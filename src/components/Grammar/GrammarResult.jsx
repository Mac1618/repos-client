import React from 'react'

function GrammarResult(props) {
  const {replacements} = props.value

  return (
   <div>
      <h4>Replacement:</h4>
      {replacements.map((prev, index) => {
        return(         
            <ul key={index}>
              <li> {prev.value}</li>
            </ul>
        )
      })}
   </div>
  )
}

export default GrammarResult;