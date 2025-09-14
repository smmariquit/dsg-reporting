// All imports at the top
import React, { useState, useEffect } from 'react';
import './App.css';
import './modern.css';
import { WordCloudViz, Histogram } from './Visualizations';
import PHChoroplethMap from './PHChoroplethMap';
import TextField from '@mui/material/TextField';
import { saveDataToFile } from './offlineUtils';
import stimmieImage from './stimmie.png';
import PHProvinceMap from './PHProvinceMap';


const skillsList = [
  'Python', 'R', 'SQL', 'Excel', 'PowerBI', 'Tableau', 'Machine Learning', 'Statistics', 'Data Visualization', 'Graphic Design'
];
const committees = [
  'Marketing and Creatives',
  'Finance',
  'Secretariat and Logistics',
  'External Affairs',
  'Training and Skills',
];

function App() {
  // Intro slide 0: Welcome
  const stimmieLogo = null; // Replace with logo import if available

  // State for the current step
  const [step, setStep] = useState(0);
  // State for the form fields
  const [form, setForm] = useState({
    wordsDescribeSelf: ['', '', ''],
    wordsDescribeDS: ['', '', ''],
    confidenceStorytelling: '',
    confidenceAnalytics: '',
    skills: [],
    competitionsJoined: '',
    committees: ['', '', ''],
    hometown: '',
    favoriteProvince: '',
    favoriteProvinceReason: '',
  });
  // State for all data (simulate as empty array for now)
  const [allData, setAllData] = useState([]);
  // Error state
  const [error, setError] = useState('');

  // Handler for input/checkbox changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'skills') {
      setForm(f => {
        let newSkills = f.skills.slice();
        if (checked) {
          newSkills.push(value);
        } else {
          newSkills = newSkills.filter(s => s !== value);
        }
        return { ...f, skills: newSkills };
      });
    } else if (name.startsWith('wordsDescribeSelf-')) {
      const idx = parseInt(name.split('-')[1], 10);
      setForm(f => {
        const newWords = [...f.wordsDescribeSelf];
        newWords[idx] = value;
        return { ...f, wordsDescribeSelf: newWords };
      });
    } else if (name.startsWith('wordsDescribeDS-')) {
      const idx = parseInt(name.split('-')[1], 10);
      setForm(f => {
        const newWords = [...f.wordsDescribeDS];
        newWords[idx] = value;
        return { ...f, wordsDescribeDS: newWords };
      });
    } else if (name.startsWith('committee-rank-')) {
      // handled inline in JSX
    } else {
      setForm(f => ({ ...f, [name]: type === 'number' ? Number(value) : value }));
    }
  };

  // Save partial form data to the API (optional, can be used for autosave)
  const partialSubmit = async (field) => {
    setError('');
    try {
      // Optionally send partial data to the server (not required for final submit)
      // await fetch('/api/interviews', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...form, partial: true, field }),
      // });
    } catch (err) {
      setError('Failed to save progress.');
    }
  };

  // Submit the form to the API and refresh allData
  const handleSubmit = async () => {
    setError('');
    try {
      const res = await fetch('/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to submit');
      // After submit, fetch all data again
      await fetchAllData();
    } catch (err) {
      setError('Submission failed. Please try again.');
    }
  };

  // Fetch all interview data from the API
  const fetchAllData = async () => {
    try {
      const res = await fetch('/api/interviews');
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      setAllData(Array.isArray(data) ? data : []);
    } catch (err) {
      setAllData([]);
      setError('Could not load data.');
    }
  };

  // Load all data on mount
  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {step === 0 && (
        <div className="screen glass-landing" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <h1 className="heading">Welcome to Stimmie!</h1>
          <p style={{ fontSize: 20, marginBottom: 32 }}>A quick survey to get to know you and your data science journey.</p>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 16, justifyContent: 'center', marginTop: 8 }}>
            <button className="primary" style={{ fontSize: 18, padding: '10px 32px' }} onClick={() => setStep(0.5)}>Start</button>
            <button className="primary" style={{ fontSize: 18, padding: '10px 32px' }} onClick={() => setStep(99)}>Summary</button>
          </div>
        </div>
      )}

      {step === 0.5 && (
        <div className="screen glass-landing" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <h2>Hi! I'm Stimmie 👋</h2>
          <img src={stimmieImage} alt="Stimmie" style={{ width: 640, marginBottom: 16 }} />
          <p style={{ fontSize: 18, marginBottom: 32, maxWidth: 480, textAlign: 'center' }}>
            I'll guide you through a few fun questions. Your answers will help us understand our community better and create awesome experiences for everyone!
          </p>
          <button className="primary" style={{ fontSize: 18, padding: '10px 32px' }} onClick={() => setStep(1)}>Let's go!</button>
        </div>
      )}

  {/* 3 words to describe yourself */}
  {step === 1 && (
        <div className="screen glass-landing">
          <h3>What 3 words best describe you?</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', margin: '24px 0' }}>
            {[0,1,2].map(i => (
              <TextField
                key={i}
                name={`wordsDescribeSelf-${i}`}
                value={form.wordsDescribeSelf[i] || ''}
                onChange={e => {
                  const value = e.target.value;
                  setForm(f => {
                    const newWords = [...f.wordsDescribeSelf];
                    newWords[i] = value;
                    return { ...f, wordsDescribeSelf: newWords };
                  });
                }}
                label={`Word ${i+1}`}
                variant="outlined"
                size="small"
                sx={{ background: 'rgba(255,255,255,0.7)', borderRadius: 2, fontFamily: 'Poppins, sans-serif', minWidth: 180 }}
                inputProps={{ maxLength: 24 }}
              />
            ))}
          </div>
          <div className="nav-row" style={{ display: 'flex', gap: 16 }}>
            <span style={{ flex: 1 }} />
            <button className="primary" onClick={async () => { await partialSubmit('wordsDescribeSelf'); setStep(1.5); }} disabled={form.wordsDescribeSelf.filter(Boolean).length !== 3}>Next</button>
          </div>
        </div>
      )}
            {step === 1.5 && (
        <div className="screen glass-landing">
          <h3>Summary</h3>
          <div style={{ margin: '24px auto 0 auto', maxWidth: 600, textAlign: 'center', fontFamily: 'Poppins, sans-serif', fontSize: 17, background: 'rgba(255,255,255,0.6)', borderRadius: 12, padding: 16 }}>
            Awesome! Your 3 words are <b>{form.wordsDescribeSelf[0]}</b>, <b>{form.wordsDescribeSelf[1]}</b>, and <b>{form.wordsDescribeSelf[2]}</b>.<br/>
            <div style={{ margin: '18px 0 0 0' }}>
              Here's a word cloud of what DSG members describe themselves as:
              <WordCloudViz
                words={allData.flatMap(d => d.wordsDescribeSelf || [])}
                fontFamily="'Poppins', 'Montserrat', 'Press Start 2P', sans-serif"
                className="word-cloud"
                cloudStyle={{
                  background: 'linear-gradient(135deg, #e4cfff 0%, #e2f1ff 100%)',
                  borderRadius: '24px',
                  boxShadow: '0 4px 24px rgba(80,80,160,0.13)',
                  padding: '18px 8px',
                  minHeight: 100,
                  maxHeight: 200,
                  margin: '0 auto',
                  width: '100%',
                  color: '#4b3fa7',
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  textShadow: '0 2px 8px rgba(80,80,160,0.10)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              />
            </div>
          </div>
          <div className="nav-row" style={{ display: 'flex', gap: 16, marginTop: 24 }}>
            <button className="secondary" onClick={() => setStep(1)}>Back</button>
            <span style={{ flex: 1 }} />
            <button className="primary" onClick={() => setStep(2)}>Next</button>
          </div>
        </div>
      )}

  {step === 2 && (
        <div className="screen glass-landing">
          <h3>What 3 words best describe Data Science?</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', margin: '24px 0' }}>
            {[0,1,2].map(i => (
              <TextField
                key={i}
                name={`wordsDescribeDS-${i}`}
                value={form.wordsDescribeDS[i] || ''}
                onChange={e => {
                  const value = e.target.value;
                  setForm(f => {
                    const newWords = [...f.wordsDescribeDS];
                    newWords[i] = value;
                    return { ...f, wordsDescribeDS: newWords };
                  });
                }}
                label={`Word ${i+1}`}
                variant="outlined"
                size="small"
                sx={{ background: 'rgba(255,255,255,0.7)', borderRadius: 2, fontFamily: 'Poppins, sans-serif', minWidth: 180 }}
                inputProps={{ maxLength: 24 }}
              />
            ))}
          </div>
          <div className="nav-row" style={{ display: 'flex', gap: 16 }}>
            <button className="secondary" onClick={() => setStep(1)}>Back</button>
            <span style={{ flex: 1 }} />
            <button className="primary" onClick={async () => { await partialSubmit('wordsDescribeDS'); setStep(3); }} disabled={form.wordsDescribeDS.filter(Boolean).length !== 3}>Next</button>
          </div>
        </div>
      )}


      {step === 3 && (
        <div className="screen glass-landing">
          <h3>Summary</h3>
          <div style={{ margin: '24px auto 0 auto', maxWidth: 600, textAlign: 'center', fontFamily: 'Poppins, sans-serif', fontSize: 17, background: 'rgba(255,255,255,0.6)', borderRadius: 12, padding: 16 }}>
            Awesome! Your 3 words are <b>{form.wordsDescribeDS[0]}</b>, <b>{form.wordsDescribeDS[1]}</b>, and <b>{form.wordsDescribeDS[2]}</b>.<br/>
            <div style={{ margin: '18px 0 0 0' }}>
              Here's a word cloud of what DSG members think about Data Science:
              <WordCloudViz words={allData.flatMap(d => d.wordsDescribeDS || [])} fontFamily="Poppins, sans-serif" className="word-cloud" />
            </div>
          </div>
          <div className="nav-row" style={{ display: 'flex', gap: 16, marginTop: 24 }}>
            <button className="secondary" onClick={() => setStep(2)}>Back</button>
            <span style={{ flex: 1 }} />
            <button className="primary" onClick={() => setStep(4)}>Next</button>
          </div>
        </div>
      )}
  {/* Confidence in writing/storytelling skills (10 buttons, 2 rows of 5) */}
  {step === 4 && (
        <div className="screen glass-landing">
          <h3>How confident are you in your writing/storytelling skills?</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center', alignItems: 'center', margin: '24px 0' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {[...Array(5)].map((_, i) => (
                <button
                  key={i}
                  className={form.confidenceStorytelling === i+1 ? 'primary' : 'secondary'}
                  style={{ minWidth: 36 }}
                  onClick={() => setForm(f => ({ ...f, confidenceStorytelling: i+1 }))}
                >{i+1}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[...Array(5)].map((_, i) => (
                <button
                  key={i+5}
                  className={form.confidenceStorytelling === i+6 ? 'primary' : 'secondary'}
                  style={{ minWidth: 36 }}
                  onClick={() => setForm(f => ({ ...f, confidenceStorytelling: i+6 }))}
                >{i+6}</button>
              ))}
            </div>
          </div>
          <div className="nav-row" style={{ display: 'flex', gap: 16 }}>
            <button className="secondary" onClick={() => setStep(3)}>Back</button>
            <span style={{ flex: 1 }} />
            <button className="primary" onClick={async () => { await partialSubmit('confidenceStorytelling'); setStep(5); }} disabled={!form.confidenceStorytelling}>Next</button>
          </div>
        </div>
      )}

  {/* Summary for confidence in storytelling */}
  {step === 5 && (
        <div className="screen glass-landing">
          <h3>Summary</h3>
          <div style={{ margin: '24px auto 0 auto', maxWidth: 600, textAlign: 'center', fontFamily: 'Poppins, sans-serif', fontSize: 17, background: 'rgba(255,255,255,0.6)', borderRadius: 12, padding: 16 }}>
            Noted! My confidence in storytelling is <span style={{ fontWeight: 500 }}>{form.confidenceStorytelling}</span> out of 10.<br/>
            <div style={{ margin: '18px 0 0 0' }}>
              Here's how DSG members rate their storytelling skills:
              <Histogram data={allData.map(d => d.confidenceStorytelling).filter(Boolean)} label="Storytelling" />
            </div>
          </div>
          <div className="nav-row" style={{ display: 'flex', gap: 16, marginTop: 24 }}>
            <button className="secondary" onClick={() => setStep(4)}>Back</button>
            <span style={{ flex: 1 }} />
            <button className="primary" onClick={() => setStep(6)}>Next</button>
          </div>
        </div>
      )}
  {/* Confidence in analytical skills (10 buttons, 2 rows of 5) */}
  {step === 6 && (
        <div className="screen glass-landing">
          <h3>How confident are you in your analytical skills?</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center', alignItems: 'center', margin: '24px 0' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {[...Array(5)].map((_, i) => (
                <button
                  key={i}
                  className={form.confidenceAnalytics === i+1 ? 'primary' : 'secondary'}
                  style={{ minWidth: 36 }}
                  onClick={() => setForm(f => ({ ...f, confidenceAnalytics: i+1 }))}
                >{i+1}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[...Array(5)].map((_, i) => (
                <button
                  key={i+5}
                  className={form.confidenceAnalytics === i+6 ? 'primary' : 'secondary'}
                  style={{ minWidth: 36 }}
                  onClick={() => setForm(f => ({ ...f, confidenceAnalytics: i+6 }))}
                >{i+6}</button>
              ))}
            </div>
          </div>
          <div className="nav-row" style={{ display: 'flex', gap: 16 }}>
            <button className="secondary" onClick={() => setStep(5)}>Back</button>
            <span style={{ flex: 1 }} />
            <button className="primary" onClick={async () => { await partialSubmit('confidenceAnalytics'); setStep(7); }} disabled={!form.confidenceAnalytics}>Next</button>
          </div>
        </div>
      )}

  {/* Summary for confidence in analytics */}
  {step === 7 && (
        <div className="screen glass-landing">
          <h3>Summary</h3>
          <div style={{ margin: '24px auto 0 auto', maxWidth: 600, textAlign: 'center', fontFamily: 'Poppins, sans-serif', fontSize: 17, background: 'rgba(255,255,255,0.6)', borderRadius: 12, padding: 16 }}>
            Got it! My confidence in analytics is <span style={{ fontWeight: 500 }}>{form.confidenceAnalytics}</span> out of 10.<br/>
            <div style={{ margin: '18px 0 0 0' }}>
              Here's how DSG members rate their analytics skills:
              <Histogram data={allData.map(d => d.confidenceAnalytics).filter(Boolean)} label="Analytics" />
            </div>
          </div>
          <div className="nav-row" style={{ display: 'flex', gap: 16, marginTop: 24 }}>
            <button className="secondary" onClick={() => setStep(6)}>Back</button>
            <span style={{ flex: 1 }} />
            <button className="primary" onClick={() => setStep(8)}>Next</button>
          </div>
        </div>
      )}
  {/* Skills */}
  {step === 8 && (
        <div className="screen glass-landing">
          <h3>Select your coding/tech and graphic design skills</h3>
          <div className="skills-list">
            {skillsList.map(skill => (
              <label key={skill} className="modern-checkbox">
                <input type="checkbox" name="skills" value={skill} checked={form.skills.includes(skill)} onChange={handleChange} /> {skill}
              </label>
            ))}
          </div>
          <div className="nav-row">
            <button className="secondary" onClick={() => setStep(7)}>Back</button>
            <button className="primary" onClick={async () => { await partialSubmit('skills'); setStep(9); }} disabled={form.skills.length === 0}>Next</button>
          </div>
        </div>
      )}

  {/* Summary for skills */}
  {step === 9 && (
        <div className="screen glass-landing">
          <h3>Summary</h3>
          <div style={{ margin: '24px auto 0 auto', maxWidth: 600, textAlign: 'center', fontFamily: 'Poppins, sans-serif', fontSize: 17, background: 'rgba(255,255,255,0.6)', borderRadius: 12, padding: 16 }}>
            I selected {form.skills.length} skill{form.skills.length !== 1 ? 's' : ''}.<br/>
            <div style={{ margin: '18px 0 0 0' }}>
              Here's how many skills DSG members have:
              <Histogram data={allData.map(d => (d.skills ? d.skills.length : 0)).filter(Boolean)} label="# of Skills" />
            </div>
          </div>
          <div className="nav-row" style={{ display: 'flex', gap: 16, marginTop: 24 }}>
            <button className="secondary" onClick={() => setStep(8)}>Back</button>
            <span style={{ flex: 1 }} />
            <button className="primary" onClick={() => setStep(10)}>Next</button>
          </div>
        </div>
      )}
  {/* Competitions */}
  {step === 10 && (
        <div className="screen glass-landing">
          <h3>How many data visualization, business case, or hackathon competitions have you joined?</h3>
          <input type="number" name="competitionsJoined" value={form.competitionsJoined} onChange={handleChange} min={0} className="modern-input" />
          <div className="nav-row">
            <button className="secondary" onClick={() => setStep(9)}>Back</button>
            <button className="primary" onClick={async () => { await partialSubmit('competitionsJoined'); setStep(11); }} disabled={form.competitionsJoined === ''}>Next</button>
          </div>
        </div>
      )}

  {/* Summary for competitions */}
  {step === 11 && (
        <div className="screen glass-landing">
          <h3>Summary</h3>
          <div style={{ margin: '24px auto 0 auto', maxWidth: 600, textAlign: 'center', fontFamily: 'Poppins, sans-serif', fontSize: 17, background: 'rgba(255,255,255,0.6)', borderRadius: 12, padding: 16 }}>
            I have joined {form.competitionsJoined || 0} competition{form.competitionsJoined === '1' ? '' : 's'} so far.<br/>
            <div style={{ margin: '18px 0 0 0' }}>
              Here's how many competitions DSG members have joined:
              <Histogram data={allData.map(d => d.competitionsJoined).filter(Boolean)} label="# Competitions" />
            </div>
          </div>
          <div className="nav-row" style={{ display: 'flex', gap: 16, marginTop: 24 }}>
            <button className="secondary" onClick={() => setStep(10)}>Back</button>
            <span style={{ flex: 1 }} />
            <button className="primary" onClick={() => setStep(12)}>Next</button>
          </div>
        </div>
      )}
  {/* Committees (ranked selection, MUI Select) */}
  {step === 12 && (
        <div className="screen glass-landing">
          <h3>Rank your top 3 committees you want to join</h3>
          <div className="committees-list" style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400, margin: '0 auto' }}>
            {[0,1,2].map(rank => (
              <div key={rank} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ minWidth: 40 }}>{['1st','2nd','3rd'][rank]}:</span>
                <TextField
                  select
                  SelectProps={{ native: true }}
                  name={`committee-rank-${rank}`}
                  value={form.committees[rank] || ''}
                  onChange={e => {
                    const value = e.target.value;
                    setForm(f => {
                      const newCommittees = [...f.committees];
                      newCommittees[rank] = value;
                      // Remove duplicates
                      for (let i = 0; i < newCommittees.length; i++) {
                        if (i !== rank && newCommittees[i] === value) newCommittees[i] = '';
                      }
                      return { ...f, committees: newCommittees };
                    });
                  }}
                  variant="outlined"
                  size="small"
                  sx={{ background: 'rgba(255,255,255,0.7)', borderRadius: 2, fontFamily: 'Poppins, sans-serif', minWidth: 180 }}
                >
                  <option value="">Select...</option>
                  {committees.filter(c => !form.committees.includes(c) || form.committees[rank] === c).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </TextField>
              </div>
            ))}
          </div>
          <div className="nav-row" style={{ display: 'flex', gap: 16 }}>
            <button className="secondary" onClick={() => setStep(11)}>Back</button>
            <span style={{ flex: 1 }} />
            <button className="primary" onClick={async () => { await partialSubmit('committees'); setStep(13); }} disabled={form.committees.length !== 3 || form.committees.includes('')}>Next</button>
          </div>
        </div>
      )}
  {/* Hometown (map) */}
  {step === 13 && (
        <div className="screen glass-landing">
          <h3>Select your hometown province</h3>
          <PHProvinceMap
            selected={form.hometown}
            onSelect={province => {
              setForm(f => ({ ...f, hometown: province }));
            }}
          />
          <div className="nav-row">
            <button className="secondary" onClick={() => setStep(12)}>Back</button>
            <button className="primary" onClick={async () => { await partialSubmit('hometown'); setStep(14); }} disabled={!form.hometown}>Next</button>
          </div>
        </div>
      )}

  {/* Hometown choropleth summary */}
  {step === 14 && (
        <div className="screen glass-landing">
          <h3>Summary</h3>
          <div className="glass-landing" style={{ margin: '24px auto 0 auto', maxWidth: 600, textAlign: 'center', fontFamily: 'Poppins, sans-serif', fontSize: 17, borderRadius: 12, padding: 16 }}>
            My hometown is <span style={{ fontWeight: 500 }}>{form.hometown}</span>.<br/>
            <div style={{ margin: '18px 0 0 0' }}>
              Here's where DSG members are from:
              <PHChoroplethMap data={allData.map(d => d.hometown).filter(Boolean)} highlight={form.hometown} />
            </div>
          </div>
          <div className="nav-row" style={{ display: 'flex', gap: 16, marginTop: 24 }}>
            <button className="secondary" onClick={() => setStep(13)}>Back</button>
            <span style={{ flex: 1 }} />
            <button className="primary" onClick={() => setStep(15)}>Next</button>
          </div>
        </div>
      )}
  {/* Favorite province choropleth and word cloud summary */}
  {step === 15 && (
        <div className="screen glass-landing">
          <h3>Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 32, alignItems: 'flex-start', justifyContent: 'center', margin: '24px auto 0 auto', maxWidth: 900 }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 17, background: 'rgba(255,255,255,0.7)', borderRadius: 12, padding: 16, marginBottom: 16, color: '#222' }}>
                My favorite province is <span style={{ fontWeight: 500 }}>{form.favoriteProvince}</span>.<br/>
                <span style={{ fontWeight: 500 }}>Reason:</span> {form.favoriteProvinceReason || <i>None</i>}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 12, padding: 12, marginBottom: 16 }}>
                <h5 style={{ margin: '8px 0 4px' }}>Reasons Word Cloud</h5>
                <WordCloudViz words={allData.map(d => d.favoriteProvinceReason).filter(Boolean)} fontFamily="Poppins, sans-serif" className="word-cloud" />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <h5 style={{ margin: '8px 0 4px' }}>Choropleth: Favorite Provinces</h5>
              <PHChoroplethMap data={allData.map(d => d.favoriteProvince).filter(Boolean)} highlight={form.favoriteProvince} />
            </div>
          </div>
          <div className="nav-row" style={{ display: 'flex', gap: 24, marginTop: 24 }}>
            <button className="secondary" onClick={() => setStep(16)}>Back</button>
            <span style={{ flex: 1 }} />
            <button className="primary" onClick={() => setStep(17)}>Next</button>
          </div>
        </div>
      )}
  {/* Favorite province (map) and one word why */}
  {step === 16 && (
        <div className="screen glass-landing">
          <h3>Favorite province aside from hometown</h3>
          <PHProvinceMap
            selected={form.favoriteProvince}
            onSelect={province => {
              setForm(f => ({ ...f, favoriteProvince: province }));
            }}
          />
          <TextField
            name="favoriteProvinceReason"
            value={form.favoriteProvinceReason}
            onChange={handleChange}
            label="One word why"
            variant="outlined"
            size="small"
            sx={{ background: 'rgba(255,255,255,0.7)', borderRadius: 2, fontFamily: 'Poppins, sans-serif', margin: '16px 0', width: 220 }}
            inputProps={{ maxLength: 32 }}
          />
          <div className="nav-row" style={{ display: 'flex', gap: 24 }}>
            <button className="secondary" onClick={() => setStep(13)}>Back</button>
            <span style={{ flex: 1 }} />
            <button className="primary" onClick={async () => { await partialSubmit('favoriteProvince'); setStep(15); }} disabled={!form.favoriteProvince || !form.favoriteProvinceReason.trim()}>Next</button>
          </div>
        </div>
      )}
  {/* Review & Submit */}
  {step === 17 && (
        <div className="screen glass-landing">
          <h3>Review & Submit</h3>
          <div className="review-box" style={{ textAlign: 'left', fontFamily: 'Poppins, sans-serif', background: 'rgba(245,247,255,0.95)', color: '#222', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(80,80,160,0.07)' }}>
            <p><span style={{ fontWeight: 500 }}>3 words to describe yourself:</span> {form.wordsDescribeSelf.filter(Boolean).join(', ') || <i>None</i>}</p>
            <p><span style={{ fontWeight: 500 }}>3 words to describe Data Science:</span> {form.wordsDescribeDS.filter(Boolean).join(', ') || <i>None</i>}</p>
            <p><span style={{ fontWeight: 500 }}>Confidence in Storytelling:</span> {form.confidenceStorytelling}</p>
            <p><span style={{ fontWeight: 500 }}>Confidence in Analytics:</span> {form.confidenceAnalytics}</p>
            <p><span style={{ fontWeight: 500 }}>Skills:</span> {form.skills.length ? form.skills.join(', ') : <i>None</i>}</p>
            <p><span style={{ fontWeight: 500 }}>Competitions Joined:</span> {form.competitionsJoined}</p>
            <p><span style={{ fontWeight: 500 }}>Committees (Ranked):</span> {form.committees.map((c,i) => c ? `${i+1}. ${c}` : null).filter(Boolean).join(' | ') || <i>None</i>}</p>
            <p><span style={{ fontWeight: 500 }}>Hometown:</span> {form.hometown || <i>None</i>}</p>
            <p><span style={{ fontWeight: 500 }}>Favorite Province:</span> {form.favoriteProvince || <i>None</i>}<br/>
            <span style={{ fontWeight: 500 }}>Reason:</span> {form.favoriteProvinceReason || <i>None</i>}</p>
          </div>
          <div className="nav-row" style={{ display: 'flex', gap: 24 }}>
            <button className="secondary" onClick={() => setStep(16)}>Back</button>
            <span style={{ flex: 1 }} />
            <button className="primary" onClick={async () => { await handleSubmit(); setStep(18); }}>Submit</button>
          </div>
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        </div>
      )}
  {/* Thank you/confirmation */}
  {step === 18 && (
        <div className="screen glass-landing">
          <h3>Thank you for submitting!</h3>
          <p>Your response has been recorded.</p>
          <div className="nav-row">
            <button className="primary" onClick={() => setStep(99)}>View Summary</button>
          </div>
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        </div>
      )}
  {/* Visualizations/summary only */}
  {step === 99 && (
        <div>
          <div className="screen glass-landing" style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: 32 }}>
            <h3>Summary & Visualizations</h3>
            <div style={{ marginBottom: 32, width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              <div>
                <h4 style={{ fontWeight: 500, margin: '16px 0 8px' }}>Your Answers</h4>
                <div style={{ fontFamily: 'Poppins, sans-serif', marginBottom: 8 }}>
                  <b>3 words to describe yourself:</b> {form.wordsDescribeSelf.filter(Boolean).join(', ') || <i>None</i>}
                </div>
                <div style={{ fontFamily: 'Poppins, sans-serif', marginBottom: 8 }}>
                  <b>3 words to describe Data Science:</b> {form.wordsDescribeDS.filter(Boolean).join(', ') || <i>None</i>}
                </div>
                <div style={{ fontFamily: 'Poppins, sans-serif', marginBottom: 8 }}>
                  <b>Confidence in Storytelling:</b> {form.confidenceStorytelling}
                </div>
                <div style={{ fontFamily: 'Poppins, sans-serif', marginBottom: 8 }}>
                  <b>Confidence in Analytics:</b> {form.confidenceAnalytics}
                </div>
                <div style={{ fontFamily: 'Poppins, sans-serif', marginBottom: 8 }}>
                  <b>Skills:</b> {form.skills.length ? form.skills.join(', ') : <i>None</i>}
                </div>
                <div style={{ fontFamily: 'Poppins, sans-serif', marginBottom: 8 }}>
                  <b>Competitions Joined:</b> {form.competitionsJoined}
                </div>
                <div style={{ fontFamily: 'Poppins, sans-serif', marginBottom: 8 }}>
                  <b>Committees:</b> {form.committees.length ? form.committees.join(', ') : <i>None</i>}
                </div>
                <div style={{ fontFamily: 'Poppins, sans-serif', marginBottom: 8 }}>
                  <b>Hometown:</b> {form.hometown || <i>None</i>}
                </div>
                <div style={{ fontFamily: 'Poppins, sans-serif', marginBottom: 8 }}>
                  <b>Favorite Province:</b> {form.favoriteProvince || <i>None</i>}<br/>
                  <b>Reason:</b> {form.favoriteProvinceReason || <i>None</i>}
                </div>
              </div>
              <div>
                <h4 style={{ fontWeight: 500, margin: '16px 0 8px' }}>Committee Choices Summary</h4>
                <div style={{ fontFamily: 'Poppins, sans-serif', background: 'rgba(255,255,255,0.7)', borderRadius: 10, padding: 12, color: '#222', marginBottom: 8 }}>
                  {form.committees.length ? form.committees.map((c, i) => <div key={i}>{i+1}. {c}</div>) : <i>None selected</i>}
                </div>
                {/* Choropleth maps moved to main visualizations below to avoid duplication */}
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center', width: '100%' }}>
              <div style={{ flex: '1 1 340px', minWidth: 340, maxWidth: 380 }}>
                <h4 style={{ fontWeight: 500, margin: '16px 0 8px' }}>Choropleth: Hometowns</h4>
                <PHChoroplethMap data={allData.map(d => d.hometown).filter(Boolean)} highlight={form.hometown} />
                <h4 style={{ fontWeight: 500, margin: '16px 0 8px' }}>Choropleth: Favorite Provinces</h4>
                <PHChoroplethMap data={allData.map(d => d.favoriteProvince).filter(Boolean)} highlight={form.favoriteProvince} />
              </div>
              <div style={{ flex: '1 1 320px', minWidth: 320, maxWidth: 360 }}>
                <h4 style={{ fontWeight: 500, margin: '16px 0 8px' }}>Word Cloud: 3 words to describe yourself</h4>
                <WordCloudViz
                  words={allData.flatMap(d => d.wordsDescribeSelf || [])}
                  fontFamily="Poppins, sans-serif"
                  className="word-cloud"
                />
                <h4 style={{ fontWeight: 500, margin: '16px 0 8px' }}>Word Cloud: 3 words to describe Data Science</h4>
                <WordCloudViz
                  words={allData.flatMap(d => d.wordsDescribeDS || [])}
                  fontFamily="Poppins, sans-serif"
                  className="word-cloud"
                />
              </div>
              <div style={{ flex: '1 1 340px', minWidth: 340, maxWidth: 380 }}>
                <h4 style={{ fontWeight: 500, margin: '16px 0 8px' }}>Choropleth: Hometowns</h4>
                <PHChoroplethMap data={allData.map(d => d.hometown).filter(Boolean)} highlight={form.hometown} />
                <h4 style={{ fontWeight: 500, margin: '16px 0 8px' }}>Choropleth: Favorite Provinces</h4>
                <PHChoroplethMap data={allData.map(d => d.favoriteProvince).filter(Boolean)} highlight={form.favoriteProvince} />
              </div>
              <div style={{ flex: '1 1 320px', minWidth: 320, maxWidth: 360 }}>
                <h5>Histogram: Confidence in Storytelling</h5>
                <Histogram data={allData.map(d => d.confidenceStorytelling).filter(Boolean)} label="Storytelling" />
                <h5>Histogram: Confidence in Analytics</h5>
                <Histogram data={allData.map(d => d.confidenceAnalytics).filter(Boolean)} label="Analytics" />
                <h5>Histogram: Competitions Joined</h5>
                <Histogram data={allData.map(d => d.competitionsJoined).filter(Boolean)} label="Competitions" />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 24 }}>
            <button className="secondary" onClick={() => setStep(17)} style={{ minWidth: 120 }}>Back</button>
          </div>
        </div>
      )}
      </>
    );
}

export default App;
