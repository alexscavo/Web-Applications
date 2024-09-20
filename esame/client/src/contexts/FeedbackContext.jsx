import React from 'react';

const FeedbackContext = React.createContext({
    setFeedback: (message) => {},
    setFeedbackFromError: (error) => {},
    setFeedbackExtraction: (message) => {}
});

export default FeedbackContext;