import React, {useState} from 'react'

 const Counter : React.FC = () => {
     console.log('Counter renders')
     const [counter, setCounter] = useState(0)
     return <div>
         <p>Vous avez cliqué {counter} fois</p>
         <button onClick={()=> setCounter(counter+1) }>Incrementer</button>
     </div>
 }
 export default Counter
