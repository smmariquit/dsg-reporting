// All imports at the top
import React, { useState, useEffect } from 'react';
import './App.css';
import './modern.css';
import { WordCloudViz, Histogram } from './Visualizations';
import PHChoroplethMap from './PHChoroplethMap';
import TextField from '@mui/material/TextField';
import { saveDataToFile } from './offlineUtils';
import PHProvinceMap from './PHProvinceMap';


const skillsList = [
  'Python', 'R', 'SQL', 'Excel', 'PowerBI', 'Tableau', 'Machine Learning', 'Statistics', 'Data Visualization', 'Graphic Design'
];
const committees = [
  'Marketing and Creatives',
  'Finance',
  'Secretariat and Logistics',


      {/* 102. Summary for 3 words to describe Data Science */}
      {step === 102 && (
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
            <button className="primary" onClick={() => setStep(3)}>Next</button>
          </div>
        </div>
      )}
      {/* 3. Confidence in writing/storytelling skills (10 buttons, 2 rows of 5) */}
      {step === 3 && (
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
            <button className="secondary" onClick={() => setStep(2)}>Back</button>
            <span style={{ flex: 1 }} />
            <button className="primary" onClick={async () => { await partialSubmit('confidenceStorytelling'); setStep(103); }} disabled={!form.confidenceStorytelling}>Next</button>
          </div>
        </div>
      )}

      {/* 103. Summary for confidence in storytelling */}
      {step === 103 && (
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
            <button className="secondary" onClick={() => setStep(3)}>Back</button>
            <span style={{ flex: 1 }} />
            <button className="primary" onClick={() => setStep(4)}>Next</button>
          </div>
        </div>
      )}
      {/* 4. Confidence in analytical skills (10 buttons, 2 rows of 5) */}
      {step === 4 && (
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
            <button className="secondary" onClick={() => setStep(103)}>Back</button>
            <span style={{ flex: 1 }} />
            <button className="primary" onClick={async () => { await partialSubmit('confidenceAnalytics'); setStep(104); }} disabled={!form.confidenceAnalytics}>Next</button>
          </div>
        </div>
      )}

      {/* 104. Summary for confidence in analytics */}
      {step === 104 && (
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
            <button className="secondary" onClick={() => setStep(4)}>Back</button>
            <span style={{ flex: 1 }} />
            <button className="primary" onClick={() => setStep(5)}>Next</button>
          </div>
        </div>
      )}
      {/* 5. Skills */}
      {step === 5 && (
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
            <button className="secondary" onClick={() => setStep(104)}>Back</button>
            <button className="primary" onClick={async () => { await partialSubmit('skills'); setStep(105); }} disabled={form.skills.length === 0}>Next</button>
          </div>
        </div>
      )}

      {/* 105. Summary for skills */}
      {step === 105 && (
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
            <button className="secondary" onClick={() => setStep(5)}>Back</button>
            <span style={{ flex: 1 }} />
            <button className="primary" onClick={() => setStep(6)}>Next</button>
          </div>
        </div>
      )}
      {/* 6. Competitions */}
      {step === 6 && (
        <div className="screen glass-landing">
          <h3>How many data visualization, business case, or hackathon competitions have you joined?</h3>
          <input type="number" name="competitionsJoined" value={form.competitionsJoined} onChange={handleChange} min={0} className="modern-input" />
          <div className="nav-row">
            <button className="secondary" onClick={() => setStep(105)}>Back</button>
            <button className="primary" onClick={async () => { await partialSubmit('competitionsJoined'); setStep(106); }} disabled={form.competitionsJoined === ''}>Next</button>
          </div>
        </div>
      )}

      {/* 106. Summary for competitions */}
      {step === 106 && (
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
            <button className="secondary" onClick={() => setStep(6)}>Back</button>
            <span style={{ flex: 1 }} />
            <button className="primary" onClick={() => setStep(7)}>Next</button>
          </div>
        </div>
      )}
      {/* 7. Committees (ranked selection, MUI Select) */}
      {step === 7 && (
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
            <button className="secondary" onClick={() => setStep(106)}>Back</button>
            <span style={{ flex: 1 }} />
            <button className="primary" onClick={async () => { await partialSubmit('committees'); setStep(8); }} disabled={form.committees.length !== 3 || form.committees.includes('')}>Next</button>
          </div>
        </div>
      )}
      {/* 8. Hometown (map) */}
      {step === 8 && (
        <div className="screen glass-landing">
          <h3>Select your hometown province</h3>
          <PHProvinceMap
            selected={form.hometown}
            onSelect={province => {
              setForm(f => ({ ...f, hometown: province }));
            }}
          />
          <div className="nav-row">
            <button className="secondary" onClick={() => setStep(7)}>Back</button>
            <button className="primary" onClick={async () => { await partialSubmit('hometown'); setStep(108); }} disabled={!form.hometown}>Next</button>
          </div>
        </div>
      )}

      {/* 108. Hometown choropleth summary */}
      {step === 108 && (
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
            <button className="secondary" onClick={() => setStep(8)}>Back</button>
            <span style={{ flex: 1 }} />
            <button className="primary" onClick={() => setStep(9)}>Next</button>
          </div>
        </div>
      )}
      {/* 109. Favorite province choropleth and word cloud summary */}
      {step === 109 && (
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
            <button className="secondary" onClick={() => setStep(9)}>Back</button>
            <span style={{ flex: 1 }} />
            <button className="primary" onClick={() => setStep(10)}>Next</button>
          </div>
        </div>
      )}
      {/* 9. Favorite province (map) and one word why */}
      {step === 9 && (
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
            <button className="secondary" onClick={() => setStep(8)}>Back</button>
            <span style={{ flex: 1 }} />
            <button className="primary" onClick={async () => { await partialSubmit('favoriteProvince'); setStep(109); }} disabled={!form.favoriteProvince || !form.favoriteProvinceReason.trim()}>Next</button>
          </div>
        </div>
      )}
      {/* 10. Review & Submit */}
      {step === 10 && (
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
            <button className="secondary" onClick={() => setStep(9)}>Back</button>
            <span style={{ flex: 1 }} />
            <button className="primary" onClick={async () => { await handleSubmit(); setStep(11); }}>Submit</button>
          </div>
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        </div>
      )}
      {/* 11. Thank you/confirmation */}
      {step === 11 && (
        <div className="screen glass-landing">
          <h3>Thank you for submitting!</h3>
          <p>Your response has been recorded.</p>
          <div className="nav-row">
            <button className="primary" onClick={() => setStep(99)}>View Summary</button>
          </div>
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        </div>
      )}
      {/* 99. Visualizations/summary only */}
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
            <button className="secondary" onClick={() => setStep(10)} style={{ minWidth: 120 }}>Back</button>
          </div>
        </div>

export default App;
