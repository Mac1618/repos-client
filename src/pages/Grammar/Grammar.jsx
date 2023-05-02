import React, {useState} from 'react'
import "./Grammar.css"
import GrammarResult from '../../components/Grammar/GrammarResult';

// Hooks
import { useGrammarContext } from '../../Hooks/useGrammarContext';
import { useAuthContext } from '../../Hooks/Auth/useAuthContext';

// import Axios from 'axios';
function Grammar() {
  const { user } = useAuthContext()

  // useGrammarContext hook descructuring
  const { grammars, dispatch } = useGrammarContext()
  const [grammar, setGrammar] = useState('');

  const [ error, setError ] = useState('');
  const handleSubmite = () => {
    if(!user){
      setError('Invalid account. No user found!')
    }

    if(grammar){
      dispatch({type: 'SET_GRAMMAR', payload: null})
      handleAPI()
    } else{
      setError('Please paste your paragraphs in the text area!')
    }
  }

  const handleAPI = async() => {
    // Grammar checker API - post
    const axios = require("axios");

    if(!user){
      return setError('Invalid account. No user found!')
    }
    const encodedParams = new URLSearchParams();
    encodedParams.append("language", "en-US");
    encodedParams.append("text", `${grammar}`);

    const options = {
      method: 'POST',
      url: `${process.env.REACT_APP_GRAMMARCHECKER_URL}`,
      headers: {
        'content-type': `${process.env.REACT_APP_GRAMMARCHECKER_CONTENT_TYPE}`,
        'X-RapidAPI-Key': `${process.env.REACT_APP_GRAMMARCHECKER_API_KEY}`,
        'X-RapidAPI-Host': `${process.env.REACT_APP_GRAMMARCHECKER_API_HOST}`
      },
      data: encodedParams
    };

    await axios.request(options).then(function (response) {  
      if(response.data){
        // setResponse(response.data)
        dispatch({type: 'SET_GRAMMAR', payload: response.data})
        setGrammar('')
        setError('')
      }
      
    // catch error
    }).catch(function (error) {
      setError(error.response.data);
    });
  }
  
  return (
    <>
      <div className="checker">

        <div className="card">
            <textarea 
              name="" id="" 
              cols="30" rows="10" 
              placeholder='Enter your manscript to be checked...'
              onChange={(e) => {
                setGrammar(e.target.value);
              }}  
              value={grammar}
            >
            </textarea>
        </div>

        <div className="control">
            <h1>Grammar Checker </h1>
            <p>To use this grammar checker you need to paste your paragraphs in the text area. The grammar checker will send you a response in a card format.</p>
            {error && <div className='error'>{error}</div>}
            <button onClick={handleSubmite}>Submit</button>
        </div>
        
      </div>
        {grammars ?
        <div className='grammar-response'>
          {grammars.matches.map((prev, index) => {
            return(
                <ul key={index} className='cards-data'>
                  <h4>Sentence:</h4>
                  <li className='data'> {prev.context.text}</li>
                  <h4>Message: </h4>
                  <li className='data'>{prev.message}</li>
                  <GrammarResult value={prev} replacements={index} />
                </ul>
            );
          })} </div> : null
        } 
    </>
  )
}

export default Grammar;