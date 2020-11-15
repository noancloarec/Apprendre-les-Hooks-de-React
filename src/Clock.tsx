import React, { useState } from 'react'
import { interval } from 'rxjs'

const Clock = () => {
    const [time, setTime] = useState('')
    // Actualise l'heure a chaque seconde
    interval(1000).subscribe(() => {
        console.log('update time')
        setTime(new Date().toLocaleTimeString())
    })
    return <p>
            Il est {time}
        </p>
}

export default Clock;
