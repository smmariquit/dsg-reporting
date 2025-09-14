// All imports at the top
import React, { useState, useEffect } from 'react';
import './App.css';
import './modern.css';
import { WordCloudViz, Histogram } from './Visualizations';
import PHChoroplethMap from './PHChoroplethMap';
import TextField from '@mui/material/TextField';
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

  // Save partial form data to the API (optional, with graceful failure)
  const partialSubmit = async (field) => {
    // Don't show errors for partial submits - they're not critical
    try {
      // Only attempt if we want to implement partial saving
      // Currently disabled but can be enabled later
      // await fetchWithTimeout('/api/interviews', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...form, partial: true, field }),
      // });
    } catch (err) {
      // Silent failure for partial submits
      console.log('Partial submit failed, continuing:', err);
    }
  };

  // Helper function to create fetch with timeout
  const fetchWithTimeout = (url, options = {}, timeout = 10000) => {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      )
    ]);
  };

  // Save data to localStorage as backup
  const saveDataToLocal = (data) => {
    try {
      localStorage.setItem('dsg-survey-data', JSON.stringify(data));
    } catch (err) {
      console.log('Could not save to localStorage:', err);
    }
  };

  // Load data from localStorage
  const loadDataFromLocal = () => {
    try {
      const data = localStorage.getItem('dsg-survey-data');
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.log('Could not load from localStorage:', err);
      return null;
    }
  };

  // Load fallback data from JSON file
  const loadFallbackData = async () => {
    try {
      const response = await fetch('/fallback-data.json');
      if (!response.ok) throw new Error('Fallback data not found');
      return await response.json();
    } catch (err) {
      console.log('Could not load fallback data:', err);
      return [];
    }
  };

  // Submit the form to the API (with graceful failure)
  const handleSubmit = async () => {
    setError('');
    try {
      const res = await fetchWithTimeout('https://dsg-reporting.onrender.com/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to submit');
      // After successful submit, fetch all data again
      await fetchAllData();
    } catch (err) {
      // If submission fails, just continue without error - silent failure
      console.log('Submission failed, continuing offline:', err);
    }
  };

  // Fetch all interview data from the API with fallback
  const fetchAllData = async () => {
    try {
      // Try to fetch from API with timeout
      const res = await fetchWithTimeout('https://dsg-reporting.onrender.com/api/interviews');
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      const validData = Array.isArray(data) ? data : [];
      
      // Save successful API data to localStorage
      saveDataToLocal(validData);
      setAllData(validData);
      setError(''); // Clear any previous errors
    } catch (err) {
      console.log('API fetch failed, trying fallback sources:', err);
      
      // Try to load from localStorage first
      const localData = loadDataFromLocal();
      if (localData && Array.isArray(localData) && localData.length > 0) {
        setAllData(localData);
        setError(''); // Don't show error if we have cached data
        return;
      }

      // If no localStorage data, try fallback JSON
      try {
        const fallbackData = await loadFallbackData();
        setAllData(Array.isArray(fallbackData) ? fallbackData : []);
        setError(''); // Don't show error if we have fallback data
      } catch (fallbackErr) {
        // Only show error if all sources fail
        setAllData([]);
        setError('Using offline mode - limited data available.');
      }
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
          <p style={{ fontSize: 20, marginBottom: 32 }}>Introducing you to the guild with a data-driven survey.</p>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 16, justifyContent: 'center', marginTop: 8 }}>
            <button className="primary" style={{ fontSize: 18, padding: '10px 32px' }} onClick={() => setStep(0.5)}>Start</button>
            <button className="primary" style={{ fontSize: 18, padding: '10px 32px' }} onClick={() => setStep(99)}>Summary</button>
          </div>
        </div>
      )}

      {step === 0.5 && (
        <div className="screen glass-landing" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <h2>Hi! I'm Stimmie 👋</h2>
          <img src={stimmieImage} alt="Stimmie" style={{ width: '100%', maxWidth: 640, height: 'auto', marginBottom: 16 }} />
          <div style={{ fontSize: 18, marginBottom: 32, maxWidth: 520, textAlign: 'center', fontFamily: 'Poppins, sans-serif' }}>
            <div style={{ 
              marginBottom: 24, 
              padding: '16px 20px', 
              background: 'rgba(255,255,255,0.15)', 
              borderRadius: 12, 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h4 style={{ 
                fontSize: 20, 
                fontWeight: 600, 
                margin: '0 0 12px 0', 
                color: '#fff',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>Today's Journey</h4>
              <div style={{ fontSize: 16, lineHeight: 1.6, color: '#f0f0f0' }}>
                ✨ Get to know you more<br/>
                ✨ Get to know me more<br/>
                ✨ Get to know the organization more!
              </div>
            </div>

            <div style={{ 
              padding: '20px 24px', 
              background: 'rgba(255,255,255,0.2)', 
              borderRadius: 12, 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.25)'
            }}>
              <h4 style={{ 
                fontSize: 20, 
                fontWeight: 600, 
                margin: '0 0 16px 0', 
                color: '#fff',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>About Me</h4>
              <div style={{ fontSize: 15, lineHeight: 1.8, color: '#f0f0f0', textAlign: 'left' }}>
                <div style={{ marginBottom: 8, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#ffeb3b', fontWeight: 'bold', minWidth: 16 }}>🎓</span>
                  <span>3rd year BS Computer Science student</span>
                </div>
                <div style={{ marginBottom: 8, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#4caf50', fontWeight: 'bold', minWidth: 16 }}>💡</span>
                  <span>Mentor, community builder, and tech enthusiast at heart</span>
                </div>
                <div style={{ marginBottom: 8, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#ff9800', fontWeight: 'bold', minWidth: 16 }}>🏆</span>
                  <span>15x hackathon joiner and 5x winner</span>
                </div>
                <div style={{ marginBottom: 8, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#e91e63', fontWeight: 'bold', minWidth: 16 }}>📰</span>
                  <span>Former campus journalist and student leader</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#2196f3', fontWeight: 'bold', minWidth: 16 }}>💻</span>
                  <span>Software engineer at E-Konsulta Medical Clinic</span>
                </div>
              </div>
            </div>
          <button className="primary" style={{ fontSize: 18, padding: '10px 32px' }} onClick={() => setStep(1)}>Let's go!</button>
          </div>
        </div>
      )}

  {/* 3 words to describe yourself */}
  {step === 1 && (
        <div className="screen glass-landing">
          <h3>What 3 words best describe you?</h3>
          <p>This is an example of qualitative data.</p>
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
          <div className="nav-row" style={{ display: 'flex', gap: 24 }}>
            <button className="secondary" onClick={() => setStep(0.5)}>Back</button>
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
                  maxHeight: 300,
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
          <div className="nav-row" style={{ display: 'flex', gap: 24, marginTop: 24 }}>
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
          <div className="nav-row" style={{ display: 'flex', gap: 24 }}>
            <button className="secondary" onClick={() => setStep(1.5)}>Back</button>
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
              <WordCloudViz words={allData.flatMap(d => d.wordsDescribeDS || [])} fontFamily="Poppins, sans-serif" className="word-cloud" 
                cloudStyle={{
                  background: 'linear-gradient(135deg, #e4cfff 0%, #e2f1ff 100%)',
                  borderRadius: '24px',
                  boxShadow: '0 4px 24px rgba(80,80,160,0.13)',
                  padding: '18px 8px',
                  minHeight: 100,
                  maxHeight: 300,
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
                }} />
            </div>
          </div>
          <div className="nav-row" style={{ display: 'flex', gap: 24, marginTop: 24 }}>
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
          <div className="nav-row" style={{ display: 'flex', gap: 24 }}>
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
            Noted! Your confidence in storytelling is <span style={{ fontWeight: 500 }}>{form.confidenceStorytelling}</span> out of 10.<br/>
            <div style={{ margin: '18px 0 0 0' }}>
              Here's how DSG members rate their storytelling skills:
              <Histogram data={allData.map(d => d.confidenceStorytelling).filter(Boolean)} label="Storytelling" />
            </div>
          </div>
          <div className="nav-row" style={{ display: 'flex', gap: 24, marginTop: 24 }}>
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
          <div className="nav-row" style={{ display: 'flex', gap: 24 }}>
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
          <div className="nav-row" style={{ display: 'flex', gap: 24, marginTop: 24 }}>
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
          <p style={{ fontSize: 16, marginBottom: 24, textAlign: 'center', color: '#fff' }}>Click on the skills you have experience with</p>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 12, 
            justifyContent: 'center', 
            alignItems: 'center', 
            margin: '24px 0',
            maxWidth: 600,
          }}>
            {skillsList.map(skill => (
              <button
                key={skill}
                className={form.skills.includes(skill) ? 'primary' : 'secondary'}
                onClick={() => {
                  setForm(f => {
                    let newSkills = [...f.skills];
                    if (f.skills.includes(skill)) {
                      newSkills = newSkills.filter(s => s !== skill);
                    } else {
                      newSkills.push(skill);
                    }
                    return { ...f, skills: newSkills };
                  });
                }}
                style={{
                  padding: '10px 16px',
                  fontSize: '14px',
                  borderRadius: '20px',
                  border: form.skills.includes(skill) ? '2px solid #a748ff' : '2px solid #ccc',
                  background: form.skills.includes(skill) 
                    ? 'linear-gradient(90deg, #a748ff 60%, #5f6c7b 100%)' 
                    : 'rgba(255,255,255,0.8)',
                  color: form.skills.includes(skill) ? '#fff' : '#333',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: form.skills.includes(skill) ? '600' : '500',
                  boxShadow: form.skills.includes(skill) 
                    ? '0 4px 12px rgba(167, 72, 255, 0.3)' 
                    : '0 2px 8px rgba(0,0,0,0.1)',
                  transform: form.skills.includes(skill) ? 'translateY(-1px)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!form.skills.includes(skill)) {
                    e.target.style.background = 'rgba(167, 72, 255, 0.1)';
                    e.target.style.borderColor = '#a748ff';
                    e.target.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!form.skills.includes(skill)) {
                    e.target.style.background = 'rgba(255,255,255,0.8)';
                    e.target.style.borderColor = '#ccc';
                    e.target.style.transform = 'none';
                  }
                }}
              >
                {skill}
              </button>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginBottom: 16, fontSize: 14, color: '#fff' }}>
            Selected: {form.skills.length} skill{form.skills.length !== 1 ? 's' : ''}
          </div>
          <div className="nav-row" style={{ display: 'flex', gap: 24, justifyContent: 'space-between', alignItems: 'center' }}>
            <button className="secondary" onClick={() => setStep(7)}>Back</button>
            <button className="primary" onClick={async () => { await partialSubmit('skills'); setStep(9); }} disabled={form.skills.length === 0}>Next</button>
          </div>
        </div>
      )}

  {/* Summary for skills */}
  {step === 9 && (
        <div className="screen glass-landing">
          <h3>Summary</h3>
          <div style={{ margin: '24px auto 0 auto', maxWidth: 700, textAlign: 'center', fontFamily: 'Poppins, sans-serif', fontSize: 17, background: 'rgba(255,255,255,0.6)', borderRadius: 12, padding: 20 }}>
            <div style={{ marginBottom: 20 }}>
              You selected <strong>{form.skills.length}</strong> skill{form.skills.length !== 1 ? 's' : ''}: <br/>
              <div style={{ margin: '12px 0', fontWeight: 500, color: '#4b3fa7' }}>
                {form.skills.join(', ') || 'None selected'}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'flex-start' }}>
              <div>
                <h5 style={{ margin: '8px 0 12px', color: '#fff' }}>Skills Distribution</h5>
                <Histogram data={allData.map(d => (d.skills ? d.skills.length : 0)).filter(Boolean)} label="# of Skills" />
              </div>
              <div>
                <h5 style={{ margin: '8px 0 12px', color: '#fff' }}>Most Popular Skills</h5>
                <div style={{ 
                  background: 'rgba(255,255,255,0.8)', 
                  borderRadius: 8, 
                  padding: 12, 
                  textAlign: 'left',
                  fontSize: 14 
                }}>
                  {(() => {
                    const skillCounts = {};
                    allData.forEach(d => {
                      if (d.skills) {
                        d.skills.forEach(skill => {
                          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
                        });
                      }
                    });
                    const topSkills = Object.entries(skillCounts)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5);
                    return topSkills.length > 0 ? (
                      <div>
                        {topSkills.map(([skill, count], i) => (
                          <div key={skill} style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            justifyContent: 'space-between', 
                            marginBottom: 8,
                            fontWeight: form.skills.includes(skill) ? 'bold' : 'normal',
                            color: form.skills.includes(skill) ? '#4b3fa7' : '#333'
                          }}>
                            <span>{i+1}. {skill}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{
                                width: Math.max(20, (count / Math.max(...topSkills.map(([,c]) => c))) * 60),
                                height: 8,
                                background: form.skills.includes(skill) ? '#4b3fa7' : '#a0a0a0',
                                borderRadius: 4
                              }} />
                              <span style={{ minWidth: 40, textAlign: 'right' }}>{count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : <span style={{ color: '#fff' }}>No data yet</span>;
                  })()}
                </div>
              </div>
            </div>
          </div>
          <div className="nav-row" style={{ display: 'flex', gap: 24, marginTop: 24 }}>
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
          <div className="nav-row" style={{ display: 'flex', gap: 24, justifyContent: 'space-between', alignItems: 'center' }}>
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
          <div className="nav-row" style={{ display: 'flex', gap: 24, marginTop: 24 }}>
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
          <p style={{ fontSize: 16, marginBottom: 24, textAlign: 'center', color: '#fff' }}>
            If you are a DSG member, select your top 3 committees before you joined
          </p>
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
          <div className="nav-row" style={{ display: 'flex', gap: 24 }}>
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
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: 32, 
            alignItems: 'start', 
            maxWidth: 900, 
            margin: '0 auto' 
          }}>
            {/* Left column - Map */}
            <div style={{ 
              background: 'rgba(255,255,255,0.8)', 
              borderRadius: 12, 
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <h4 style={{ margin: '0 0 16px', color: '#222', fontFamily: 'Poppins, sans-serif' }}>Select Province</h4>
              <div style={{ width: '100%', maxWidth: 350, overflow: 'hidden' }}>
                <PHProvinceMap
                  selected={form.hometown}
                  onSelect={province => {
                    setForm(f => ({ ...f, hometown: province }));
                  }}
                />
              </div>
            </div>
            {/* Right column - Info */}
            <div style={{ 
              background: 'rgba(255,255,255,0.8)', 
              borderRadius: 12, 
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minHeight: 200
            }}>
              <h4 style={{ margin: '0 0 16px', color: '#222', fontFamily: 'Poppins, sans-serif' }}>Instructions</h4>
              <p style={{ color: '#444', fontFamily: 'Poppins, sans-serif', lineHeight: 1.6, margin: 0 }}>
                Click on your hometown province on the map. This will help us understand the geographic distribution of DSG members.
              </p>
              {form.hometown && (
                <div style={{ 
                  marginTop: 16, 
                  padding: 12, 
                  background: 'rgba(76, 175, 80, 0.1)', 
                  borderRadius: 8, 
                  border: '1px solid rgba(76, 175, 80, 0.3)' 
                }}>
                  <p style={{ margin: 0, color: '#2E7D32', fontWeight: 500 }}>
                    Selected: {form.hometown}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="nav-row" style={{ display: 'flex', gap: 24, justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
            <button className="secondary" onClick={() => setStep(12)}>Back</button>
            <button className="primary" onClick={async () => { await partialSubmit('hometown'); setStep(14); }} disabled={!form.hometown}>Next</button>
          </div>
        </div>
      )}

  {/* Hometown choropleth summary */}
  {step === 14 && (
        <div className="screen glass-landing">
          <h3>Summary</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: 32, 
            alignItems: 'start', 
            maxWidth: 900, 
            margin: '0 auto' 
          }}>
            {/* Left column - Map */}
            <div style={{ 
              background: 'rgba(255,255,255,0.8)', 
              borderRadius: 12, 
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <h4 style={{ margin: '0 0 16px', color: '#222', fontFamily: 'Poppins, sans-serif' }}>DSG Members' Hometowns</h4>
              <div style={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ maxWidth: 280, maxHeight: 280 }}>
                  <PHChoroplethMap data={allData.map(d => d.hometown).filter(Boolean)} highlight={form.hometown} />
                </div>
              </div>
            </div>
            {/* Right column - Summary */}
            <div style={{ 
              background: 'rgba(255,255,255,0.8)', 
              borderRadius: 12, 
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <h4 style={{ margin: '0 0 16px', color: '#222', fontFamily: 'Poppins, sans-serif' }}>Your Selection</h4>
              <div style={{ 
                padding: 16, 
                background: 'rgba(33, 150, 243, 0.1)', 
                borderRadius: 8, 
                border: '1px solid rgba(33, 150, 243, 0.3)',
                marginBottom: 16
              }}>
                <p style={{ margin: 0, color: '#1976D2', fontWeight: 500, fontSize: 18 }}>
                  My hometown is {form.hometown}
                </p>
              </div>
              <p style={{ color: '#444', fontFamily: 'Poppins, sans-serif', lineHeight: 1.6, margin: 0 }}>
                The map on the left shows where all DSG members are from. Your hometown is highlighted in a different color.
              </p>
            </div>
          </div>
          <div className="nav-row" style={{ display: 'flex', gap: 24, marginTop: 24 }}>
            <button className="secondary" onClick={() => setStep(13)}>Back</button>
            <span style={{ flex: 1 }} />
            <button className="primary" onClick={() => setStep(15)}>Next</button>
          </div>
        </div>
      )}
  {/* Favorite province (map) and one word why */}
  {step === 15 && (
        <div className="screen glass-landing">
          <h3>Favorite province aside from hometown</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: 32, 
            alignItems: 'start', 
            maxWidth: 900, 
            margin: '0 auto' 
          }}>
            {/* Left column - Map */}
            <div style={{ 
              background: 'rgba(255,255,255,0.8)', 
              borderRadius: 12, 
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <h4 style={{ margin: '0 0 16px', color: '#222', fontFamily: 'Poppins, sans-serif' }}>Select Province</h4>
              <div style={{ width: '100%', maxWidth: 350, overflow: 'hidden' }}>
                <PHProvinceMap
                  selected={form.favoriteProvince}
                  onSelect={province => {
                    setForm(f => ({ ...f, favoriteProvince: province }));
                  }}
                />
              </div>
            </div>
            {/* Right column - Input and info */}
            <div style={{ 
              background: 'rgba(255,255,255,0.8)', 
              borderRadius: 12, 
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <h4 style={{ margin: '0 0 16px', color: '#222', fontFamily: 'Poppins, sans-serif' }}>Tell us why</h4>
              <p style={{ color: '#444', fontFamily: 'Poppins, sans-serif', lineHeight: 1.6, marginBottom: 16 }}>
                Click on your favorite province (other than your hometown) and tell us why in one word.
              </p>
              <TextField
                name="favoriteProvinceReason"
                value={form.favoriteProvinceReason}
                onChange={handleChange}
                label="One word why"
                variant="outlined"
                size="small"
                sx={{ 
                  background: 'rgba(255,255,255,0.9)', 
                  borderRadius: 2, 
                  fontFamily: 'Poppins, sans-serif',
                  marginBottom: 2
                }}
                inputProps={{ maxLength: 32 }}
                fullWidth
              />
              {form.favoriteProvince && (
                <div style={{ 
                  marginTop: 16, 
                  padding: 12, 
                  background: 'rgba(76, 175, 80, 0.1)', 
                  borderRadius: 8, 
                  border: '1px solid rgba(76, 175, 80, 0.3)' 
                }}>
                  <p style={{ margin: 0, color: '#2E7D32', fontWeight: 500 }}>
                    Selected: {form.favoriteProvince}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="nav-row" style={{ display: 'flex', gap: 24, marginTop: 24 }}>
            <button className="secondary" onClick={() => setStep(14)}>Back</button>
            <span style={{ flex: 1 }} />
            <button className="primary" onClick={async () => { await partialSubmit('favoriteProvince'); setStep(16); }} disabled={!form.favoriteProvince || !form.favoriteProvinceReason.trim()}>Next</button>
          </div>
        </div>
      )}
  {/* Favorite province choropleth and word cloud summary */}
  {step === 16 && (
        <div className="screen glass-landing">
          <h3>Summary</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: 32, 
            alignItems: 'start', 
            maxWidth: 900, 
            margin: '0 auto' 
          }}>
            {/* Left column - Map */}
            <div style={{ 
              background: 'rgba(255,255,255,0.8)', 
              borderRadius: 12, 
              padding: 20
            }}>
              <h4 style={{ margin: '0 0 16px', color: '#222', fontFamily: 'Poppins, sans-serif', textAlign: 'center' }}>Favorite Provinces</h4>
              <div style={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ maxWidth: 280, maxHeight: 280 }}>
                  <PHChoroplethMap data={allData.map(d => d.favoriteProvince).filter(Boolean)} highlight={form.favoriteProvince} />
                </div>
              </div>
            </div>
            {/* Right column - Word cloud and summary */}
            <div style={{ 
              background: 'rgba(255,255,255,0.8)', 
              borderRadius: 12, 
              padding: 20
            }}>
              <h4 style={{ margin: '0 0 16px', color: '#222', fontFamily: 'Poppins, sans-serif' }}>Your Selection</h4>
              <div style={{ 
                padding: 16, 
                background: 'rgba(33, 150, 243, 0.1)', 
                borderRadius: 8, 
                border: '1px solid rgba(33, 150, 243, 0.3)',
                marginBottom: 16
              }}>
                <p style={{ margin: '0 0 8px', color: '#1976D2', fontWeight: 500, fontSize: 16 }}>
                  My favorite province is {form.favoriteProvince}
                </p>
                <p style={{ margin: 0, color: '#1976D2', fontSize: 14 }}>
                  <strong>Reason:</strong> {form.favoriteProvinceReason || <i>None</i>}
                </p>
              </div>
              <h5 style={{ margin: '16px 0 12px', color: '#222', fontFamily: 'Poppins, sans-serif' }}>Reasons Word Cloud</h5>
              <div style={{ height: 180, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <WordCloudViz words={allData.map(d => d.favoriteProvinceReason).filter(Boolean)} fontFamily="Poppins, sans-serif" className="word-cloud" />
              </div>
            </div>
          </div>
          <div className="nav-row" style={{ display: 'flex', gap: 24, marginTop: 24 }}>
            <button className="secondary" onClick={() => setStep(15)}>Back</button>
            <span style={{ flex: 1 }} />
            <button className="primary" onClick={() => setStep(17)}>Next</button>
          </div>
        </div>
      )}
  {/* Review & Submit */}
  {step === 17 && (
        <div className="screen glass-landing">
          <h3>Review & Submit</h3>
          <div className="review-box" style={{ textAlign: 'left', fontFamily: 'Poppins, sans-serif', background: 'rgba(245,247,255,0.95)', color: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(80,80,160,0.07)' }}>
            <p><span style={{ fontWeight: 500, color: '#222' }}>3 words to describe yourself:</span> <span style={{ color: '#222' }}>{form.wordsDescribeSelf.filter(Boolean).join(', ') || <i>None</i>}</span></p>
            <p><span style={{ fontWeight: 500, color: '#222' }}>3 words to describe Data Science:</span> <span style={{ color: '#222' }}>{form.wordsDescribeDS.filter(Boolean).join(', ') || <i>None</i>}</span></p>
            <p><span style={{ fontWeight: 500, color: '#222' }}>Confidence in Storytelling:</span> <span style={{ color: '#222' }}>{form.confidenceStorytelling}</span></p>
            <p><span style={{ fontWeight: 500, color: '#222' }}>Confidence in Analytics:</span> <span style={{ color: '#222 ' }}>{form.confidenceAnalytics}</span></p>
            <p><span style={{ fontWeight: 500, color: '#222' }}>Skills:</span> <span style={{ color: '#222' }}>{form.skills.length ? form.skills.join(', ') : <i>None</i>}</span></p>
            <p><span style={{ fontWeight: 500, color: '#222' }}>Competitions Joined:</span> <span style={{ color: '#222' }}>{form.competitionsJoined}</span></p>
            <p><span style={{ fontWeight: 500, color: '#222' }}>Committees (Ranked):</span> <span style={{ color: '#222' }}>{form.committees.map((c,i) => c ? `${i+1}. ${c}` : null).filter(Boolean).join(' | ') || <i>None</i>}</span></p>
            <p><span style={{ fontWeight: 500, color: '#222' }}>Hometown:</span> <span style={{ color: '#222' }}>{form.hometown || <i>None</i>}</span></p>
            <p><span style={{ fontWeight: 500, color: '#222' }}>Favorite Province:</span> <span style={{ color: '#222' }}>{form.favoriteProvince || <i>None</i>}</span><br/>
            <span style={{ fontWeight: 500, color: '#222' }}>Reason:</span> <span style={{ color: '#222' }}>{form.favoriteProvinceReason || <i>None</i>}</span></p>
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
          <div className="nav-row" style={{ display: 'flex', gap: 24, justifyContent: 'space-between', alignItems: 'center' }}>
            <button className="secondary" onClick={() => setStep(17)}>Back</button>
            <button className="primary" onClick={() => setStep(99)}>View Summary</button>
          </div>
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        </div>
      )}
  {/* Visualizations/summary only */}
  {step === 99 && (
        <div className="screen glass-landing" style={{ 
          width: '100%', 
          maxWidth: 1200, 
          margin: '0 auto', 
          padding: 32, 
          boxSizing: 'border-box', 
          minHeight: 'auto',
          justifyContent: 'flex-start',
          alignItems: 'stretch'
        }}>
          <h3>Summary & Visualizations</h3>
            
            {/* Personal Answers Section */}
            <div style={{ 
              marginBottom: 32, 
              width: '100%', 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: 24 
            }}>
              <div style={{ 
                background: 'rgba(255,255,255,0.8)', 
                borderRadius: 12, 
                padding: 20,
                boxShadow: '0 2px 12px rgba(80,80,160,0.1)'
              }}>
                <h4 style={{ fontWeight: 500, margin: '0 0 16px', color: '#222' }}>Your Answers</h4>
                <div style={{ fontFamily: 'Poppins, sans-serif', marginBottom: 8, color: '#222' }}>
                  <b>3 words to describe yourself:</b> {form.wordsDescribeSelf.filter(Boolean).join(', ') || <i>None</i>}
                </div>
                <div style={{ fontFamily: 'Poppins, sans-serif', marginBottom: 8, color: '#222' }}>
                  <b>3 words to describe Data Science:</b> {form.wordsDescribeDS.filter(Boolean).join(', ') || <i>None</i>}
                </div>
                <div style={{ fontFamily: 'Poppins, sans-serif', marginBottom: 8, color: '#222' }}>
                  <b>Confidence in Storytelling:</b> {form.confidenceStorytelling}
                </div>
                <div style={{ fontFamily: 'Poppins, sans-serif', marginBottom: 8, color: '#222' }}>
                  <b>Confidence in Analytics:</b> {form.confidenceAnalytics}
                </div>
                <div style={{ fontFamily: 'Poppins, sans-serif', marginBottom: 8, color: '#222' }}>
                  <b>Skills:</b> {form.skills.length ? form.skills.join(', ') : <i>None</i>}
                </div>
                <div style={{ fontFamily: 'Poppins, sans-serif', marginBottom: 8, color: '#222' }}>
                  <b>Competitions Joined:</b> {form.competitionsJoined}
                </div>
              </div>
              
              <div style={{ 
                background: 'rgba(255,255,255,0.8)', 
                borderRadius: 12, 
                padding: 20,
                boxShadow: '0 2px 12px rgba(80,80,160,0.1)'
              }}>
                <h4 style={{ fontWeight: 500, margin: '0 0 16px', color: '#222' }}>Committee & Location Info</h4>
                <div style={{ fontFamily: 'Poppins, sans-serif', marginBottom: 8, color: '#222' }}>
                  <b>Committees:</b> {form.committees.length ? form.committees.join(', ') : <i>None</i>}
                </div>
                <div style={{ fontFamily: 'Poppins, sans-serif', marginBottom: 8, color: '#222' }}>
                  <b>Hometown:</b> {form.hometown || <i>None</i>}
                </div>
                <div style={{ fontFamily: 'Poppins, sans-serif', marginBottom: 8, color: '#222' }}>
                  <b>Favorite Province:</b> {form.favoriteProvince || <i>None</i>}
                </div>
                <div style={{ fontFamily: 'Poppins, sans-serif', marginBottom: 8, color: '#222' }}>
                  <b>Reason:</b> {form.favoriteProvinceReason || <i>None</i>}
                </div>
              </div>
            </div>

            {/* Visualizations Section - Single Column Layout */}
            
            {/* Word Clouds */}
            <div style={{ 
              background: 'rgba(255,255,255,0.8)', 
              borderRadius: 12, 
              padding: 30,
              boxShadow: '0 2px 12px rgba(80,80,160,0.1)',
              marginBottom: 32
            }}>
              <h4 style={{ fontWeight: 500, margin: '0 0 24px', color: '#222', textAlign: 'center' }}>Word Clouds</h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: 32
              }}>
                <div>
                  <h5 style={{ fontWeight: 500, margin: '0 0 16px', color: '#222', textAlign: 'center' }}>Describe Yourself</h5>
                  <div style={{ minHeight: 400, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(240,240,255,0.5)', borderRadius: 8, padding: 20 }}>
                    <WordCloudViz
                      words={allData.flatMap(d => d.wordsDescribeSelf || [])}
                      fontFamily="Poppins, sans-serif"
                      className="word-cloud"
                      cloudStyle={{ minHeight: 350, width: '100%' }}
                    />
                  </div>
                </div>
                <div>
                  <h5 style={{ fontWeight: 500, margin: '0 0 16px', color: '#222', textAlign: 'center' }}>Describe Data Science</h5>
                  <div style={{ minHeight: 400, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(240,240,255,0.5)', borderRadius: 8, padding: 20 }}>
                    <WordCloudViz
                      words={allData.flatMap(d => d.wordsDescribeDS || [])}
                      fontFamily="Poppins, sans-serif"
                      className="word-cloud"
                      cloudStyle={{ minHeight: 350, width: '100%' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Confidence Histograms */}
            <div style={{ 
              background: 'rgba(255,255,255,0.8)', 
              borderRadius: 12, 
              padding: 30,
              boxShadow: '0 2px 12px rgba(80,80,160,0.1)',
              marginBottom: 32
            }}>
              <h4 style={{ fontWeight: 500, margin: '0 0 24px', color: '#222', textAlign: 'center' }}>Confidence Levels</h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: 32
              }}>
                <div>
                  <h5 style={{ fontWeight: 500, margin: '0 0 16px', color: '#222', textAlign: 'center' }}>Storytelling Confidence</h5>
                  <div style={{ minHeight: 400, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(240,240,255,0.5)', borderRadius: 8, padding: 20 }}>
                    <Histogram data={allData.map(d => d.confidenceStorytelling).filter(Boolean)} label="Storytelling" />
                  </div>
                </div>
                <div>
                  <h5 style={{ fontWeight: 500, margin: '0 0 16px', color: '#222', textAlign: 'center' }}>Analytics Confidence</h5>
                  <div style={{ minHeight: 400, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(240,240,255,0.5)', borderRadius: 8, padding: 20 }}>
                    <Histogram data={allData.map(d => d.confidenceAnalytics).filter(Boolean)} label="Analytics" />
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Analysis */}
            <div style={{ 
              background: 'rgba(255,255,255,0.8)', 
              borderRadius: 12, 
              padding: 30,
              boxShadow: '0 2px 12px rgba(80,80,160,0.1)',
              marginBottom: 32
            }}>
              <h4 style={{ fontWeight: 500, margin: '0 0 24px', color: '#222', textAlign: 'center' }}>Skills Analysis</h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: 32
              }}>
                <div>
                  <h5 style={{ fontWeight: 500, margin: '0 0 16px', color: '#222', textAlign: 'center' }}>Popular Skills</h5>
                  <div style={{ height: 350, padding: 16, background: 'rgba(240,240,255,0.5)', borderRadius: 8, overflowY: 'auto' }}>
                    {(() => {
                      const skillCounts = {};
                      allData.forEach(d => {
                        if (d.skills) {
                          d.skills.forEach(skill => {
                            skillCounts[skill] = (skillCounts[skill] || 0) + 1;
                          });
                        }
                      });
                      const topSkills = Object.entries(skillCounts)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 10);
                      
                      return topSkills.length > 0 ? (
                        <div style={{ fontSize: 15 }}>
                          {topSkills.map(([skill, count], i) => (
                            <div key={skill} style={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              justifyContent: 'space-between', 
                              marginBottom: 12,
                              padding: 12,
                              background: form.skills.includes(skill) ? 'rgba(167, 72, 255, 0.15)' : 'rgba(255, 255, 255, 0.8)',
                              borderRadius: 8,
                              border: form.skills.includes(skill) ? '2px solid #a748ff' : '1px solid #ddd'
                            }}>
                              <span style={{ fontWeight: form.skills.includes(skill) ? 'bold' : 'normal' }}>
                                {i+1}. {skill}
                              </span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{
                                  width: Math.max(20, (count / Math.max(...topSkills.map(([,c]) => c))) * 80),
                                  height: 8,
                                  background: form.skills.includes(skill) ? '#a748ff' : '#999',
                                  borderRadius: 4
                                }} />
                                <span style={{ minWidth: 30, textAlign: 'right', fontWeight: 'bold' }}>{count}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : <span style={{ color: '#666', fontStyle: 'italic' }}>No data yet</span>;
                    })()}
                  </div>
                </div>
                <div>
                  <h5 style={{ fontWeight: 500, margin: '0 0 16px', color: '#222', textAlign: 'center' }}>Skills Distribution</h5>
                  <div style={{ height: 350, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(240,240,255,0.5)', borderRadius: 8 }}>
                    <Histogram data={allData.map(d => (d.skills ? d.skills.length : 0)).filter(Boolean)} label="# of Skills" />
                  </div>
                </div>
              </div>
            </div>

            {/* Activity & Preferences */}
            <div style={{ 
              background: 'rgba(255,255,255,0.8)', 
              borderRadius: 12, 
              padding: 30,
              boxShadow: '0 2px 12px rgba(80,80,160,0.1)',
              marginBottom: 32
            }}>
              <h4 style={{ fontWeight: 500, margin: '0 0 24px', color: '#222', textAlign: 'center' }}>Activity & Preferences</h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: 32
              }}>
                <div>
                  <h5 style={{ fontWeight: 500, margin: '0 0 16px', color: '#222', textAlign: 'center' }}>Competitions Joined</h5>
                  <div style={{ height: 350, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(240,240,255,0.5)', borderRadius: 8 }}>
                    <Histogram data={allData.map(d => d.competitionsJoined).filter(Boolean)} label="Competitions" />
                  </div>
                </div>
                <div>
                  <h5 style={{ fontWeight: 500, margin: '0 0 16px', color: '#222', textAlign: 'center' }}>Committee Preferences</h5>
                  <div style={{ height: 350, padding: 16, background: 'rgba(240,240,255,0.5)', borderRadius: 8, overflowY: 'auto' }}>
                    {(() => {
                      const committeeCounts = {};
                      allData.forEach(d => {
                        if (d.committees) {
                          d.committees.forEach((committee, index) => {
                            if (committee) {
                              if (!committeeCounts[committee]) committeeCounts[committee] = { first: 0, second: 0, third: 0, total: 0 };
                              if (index === 0) committeeCounts[committee].first++;
                              else if (index === 1) committeeCounts[committee].second++;
                              else if (index === 2) committeeCounts[committee].third++;
                              committeeCounts[committee].total++;
                            }
                          });
                        }
                      });
                      const sortedCommittees = Object.entries(committeeCounts)
                        .sort(([,a], [,b]) => b.total - a.total);
                      
                      return sortedCommittees.length > 0 ? (
                        <div style={{ fontSize: 14 }}>
                          {sortedCommittees.map(([committee, counts]) => (
                            <div key={committee} style={{ 
                              marginBottom: 12,
                              padding: 12,
                              background: form.committees.includes(committee) ? 'rgba(167, 72, 255, 0.15)' : 'rgba(255, 255, 255, 0.8)',
                              borderRadius: 8,
                              border: form.committees.includes(committee) ? '2px solid #a748ff' : '1px solid #ddd'
                            }}>
                              <div style={{ fontWeight: 'bold', marginBottom: 6, color: '#333' }}>{committee}</div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#666' }}>
                                <span>1st: {counts.first}</span>
                                <span>2nd: {counts.second}</span>
                                <span>3rd: {counts.third}</span>
                                <span style={{ fontWeight: 'bold' }}>Total: {counts.total}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : <span style={{ color: '#666', fontStyle: 'italic' }}>No data yet</span>;
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* Geographic Analysis */}
            <div style={{ 
              background: 'rgba(255,255,255,0.8)', 
              borderRadius: 12, 
              padding: 30,
              boxShadow: '0 2px 12px rgba(80,80,160,0.1)',
              marginBottom: 32
            }}>
              <h4 style={{ fontWeight: 500, margin: '0 0 24px', color: '#222', textAlign: 'center' }}>Geographic Analysis</h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: 32
              }}>
                <div>
                  <h5 style={{ fontWeight: 500, margin: '0 0 16px', color: '#222', textAlign: 'center' }}>Province Reasons</h5>
                  <div style={{ height: 350, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(240,240,255,0.5)', borderRadius: 8 }}>
                    <WordCloudViz 
                      words={allData.map(d => d.favoriteProvinceReason).filter(Boolean)} 
                      fontFamily="Poppins, sans-serif" 
                      className="word-cloud" 
                      cloudStyle={{ height: 330 }}
                    />
                  </div>
                </div>
                <div>
                  <h5 style={{ fontWeight: 500, margin: '0 0 16px', color: '#222', textAlign: 'center' }}>Geographic Summary</h5>
                  <div style={{ height: 450, padding: 16, background: 'rgba(240,240,255,0.5)', borderRadius: 8, fontSize: 16 }}>
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontWeight: 'bold', color: '#333', marginBottom: 8, fontSize: 18 }}>Your Location Info:</div>
                      <div style={{ color: '#555', fontSize: 15, lineHeight: 1.6 }}>
                        <div style={{ marginBottom: 4 }}>🏠 Hometown: <strong>{form.hometown || 'Not selected'}</strong></div>
                        <div style={{ marginBottom: 4 }}>❤️ Favorite: <strong>{form.favoriteProvince || 'Not selected'}</strong></div>
                        {form.favoriteProvinceReason && <div style={{ marginBottom: 4 }}>💭 Reason: <em>"{form.favoriteProvinceReason}"</em></div>}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#333', marginBottom: 8, fontSize: 18 }}>Community Stats:</div>
                      <div style={{ color: '#555', fontSize: 15, lineHeight: 1.6 }}>
                        <div style={{ marginBottom: 4 }}>👥 Total Responses: <strong>{allData.length}</strong></div>
                        <div style={{ marginBottom: 4 }}>📍 Unique Hometowns: <strong>{new Set(allData.map(d => d.hometown).filter(Boolean)).size}</strong></div>
                        <div>⭐ Unique Favorites: <strong>{new Set(allData.map(d => d.favoriteProvince).filter(Boolean)).size}</strong></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Geographic Maps */}
            <div style={{ 
              background: 'rgba(255,255,255,0.8)', 
              borderRadius: 12, 
              padding: 30,
              boxShadow: '0 2px 12px rgba(80,80,160,0.1)',
              marginBottom: 32
            }}>
              <h4 style={{ fontWeight: 500, margin: '0 0 24px', color: '#222', textAlign: 'center' }}>Geographic Distribution</h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: 32
              }}>
                <div>
                  <h5 style={{ fontWeight: 500, margin: '0 0 16px', color: '#222', textAlign: 'center' }}>Hometowns</h5>
                  <div style={{ height: 550, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(240,240,255,0.5)', borderRadius: 8 }}>
                    <div style={{ maxWidth: 400, maxHeight: 400 }}>
                      <PHChoroplethMap data={allData.map(d => d.hometown).filter(Boolean)} highlight={form.hometown} />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 style={{ fontWeight: 500, margin: '0 0 16px', color: '#222', textAlign: 'center' }}>Favorite Provinces</h5>
                  <div style={{ height: 550, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(240,240,255,0.5)', borderRadius: 8 }}>
                    <div style={{ maxWidth: 400, maxHeight: 400 }}>
                      <PHChoroplethMap data={allData.map(d => d.favoriteProvince).filter(Boolean)} highlight={form.favoriteProvince} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          <div className="nav-row" style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 32 }}>
            <button className="secondary" onClick={() => setStep(18)} style={{ minWidth: 120 }}>Back</button>
          </div>
        </div>
      )}
      </>
    );
}

export default App;
