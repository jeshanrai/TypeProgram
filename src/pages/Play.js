import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Siderbar from './playcomponents/Siderbar';
import PlayArea from './playcomponents/PlayArea';
import './Play.css';

export default function Play() {
  // Hooks first
  const [snippetPreview, setSnippetPreview] = useState('');

  const isLoggedIn = !!localStorage.getItem('token');

  // Conditional return after hooks
  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />
  }

  return (
    <div className='playdiv'>
      <Siderbar snippetPreview={snippetPreview} />
      <PlayArea setSnippetPreview={setSnippetPreview} />
    </div>
  );
}
