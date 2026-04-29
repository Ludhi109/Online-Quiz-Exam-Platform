import { useState } from 'react';
import axios from 'axios';

const AddQuestionModal = ({ exam, onClose, onQuestionAdded }) => {
  const [formData, setFormData] = useState({
    type: 'MCQ',
    text: '',
    correctAnswer: '',
    marks: 1
  });
  const [options, setOptions] = useState(['', '', '', '']); // 4 options for MCQ
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        options: formData.type === 'MCQ' ? options.filter(o => o.trim() !== '') : null
      };

      await axios.post(`http://localhost:5000/api/admin/exams/${exam.id}/questions`, payload);
      onQuestionAdded();
      
      // Reset form
      setFormData({ type: 'MCQ', text: '', correctAnswer: '', marks: 1 });
      setOptions(['', '', '', '']);
      alert('Question added successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', 
      justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div className="glass-panel" style={{ 
        width: '90%', maxWidth: '600px', maxHeight: '90vh', 
        overflowY: 'auto', padding: '2rem', position: 'relative'
      }}>
        <button 
          onClick={onClose} 
          className="btn-danger" 
          style={{ position: 'absolute', top: '1rem', right: '1rem' }}
        >
          Close
        </button>
        
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>
          Add Question to "{exam.title}"
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Question Type</label>
            <select 
              className="input-field" 
              value={formData.type} 
              onChange={e => setFormData({...formData, type: e.target.value})}
            >
              <option value="MCQ">Multiple Choice</option>
              <option value="SHORT_ANSWER">Short Answer</option>
              <option value="CODING">Coding</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Question Text</label>
            <textarea 
              className="input-field" 
              value={formData.text}
              onChange={e => setFormData({...formData, text: e.target.value})}
              required
              style={{ minHeight: '80px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Marks</label>
            <input 
              type="number" 
              className="input-field" 
              value={formData.marks}
              onChange={e => setFormData({...formData, marks: parseInt(e.target.value)})}
              min="1"
              required
            />
          </div>

          {formData.type === 'MCQ' && (
            <div style={{ borderLeft: '3px solid var(--accent-primary)', paddingLeft: '1rem', marginTop: '0.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Options</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {options.map((opt, idx) => (
                  <input 
                    key={idx}
                    type="text" 
                    className="input-field" 
                    placeholder={`Option ${idx + 1}`}
                    value={opt}
                    onChange={e => handleOptionChange(idx, e.target.value)}
                    required={idx < 2} // Require at least 2 options
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
              Correct Answer {formData.type === 'MCQ' && '(must exactly match one option)'}
            </label>
            <input 
              type="text" 
              className="input-field" 
              value={formData.correctAnswer}
              onChange={e => setFormData({...formData, correctAnswer: e.target.value})}
              required
            />
          </div>

          <button type="submit" className="btn-success" style={{ marginTop: '1rem', padding: '1rem' }} disabled={loading}>
            {loading ? 'Adding...' : 'Add Question'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddQuestionModal;
