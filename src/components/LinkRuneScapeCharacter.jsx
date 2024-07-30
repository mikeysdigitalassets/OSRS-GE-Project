import React, { useState } from 'react';
import axios from 'axios';

const LinkRuneScapeCharacter = ({ userId }) => {
  const [characterName, setCharacterName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert('User ID is missing');
      return;
    }
    try {
      const response = await axios.post(`http://localhost:5000/api/user/${userId}/link-character`, {
        characterName
      });
      alert('Character linked successfully!');
    } catch (error) {
      console.error('Error linking character:', error);
      alert('Failed to link character.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        RuneScape Character Name:
        <input
          type="text"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          required
        />
      </label>
      <button type="submit">Link Character</button>
    </form>
  );
};

export default LinkRuneScapeCharacter;
