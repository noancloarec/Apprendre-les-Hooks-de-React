
# 1. Le Hook useState
## 1.1. Les Function Components
Considérons le composant `Counter` qui compte le nombre de clics sur un bouton.  
```tsx
import React from 'react'

const Counter : React.FC = () => {
    console.log('Counter renders')
    let counter = 0;
    return <div>
        <p>Vous avez cliqué {counter} fois</p>
        <button onClick={()=> counter++ }>Incrementer</button>
    </div>
}
export default Counter
```
Lancer le projet : `npm start`, cliquer sur incrementer et observer la console.
  
  Q1: Combien de fois le composant est-il rendu? Quand?
<details> 
  <summary>Réponse </summary>
   Seulement 1 fois, au démarrage 
</details>
   
   <br>
   
  Q2: Pourquoi?
<details> 
  <summary>Réponse</summary>
    
    La fonction `() => counter++` dans le bouton ne dit pas à React de mettre à jour le composant 
   <details> 
        <summary>Q2.1: Si le composant était rendu a chaque clic, fonctionnerait-il? </summary>
        Non. La variable counter est déclarée et initialisée à chaque appel de la fonction. La fonction étant appelée à chaque rendu, la valeur resterait à 0
    </details>
</details>  
<br />

## 1.2. useState()
 Modifier le composant avec `useState` pour atteindre le comportement voulu.
<details> 
  <summary>Solution</summary>
   
   ```tsx
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
   ``` 
</details>

Observer à nouveau le comportement (nombre de rendus), en cliquant 1 fois sur le bouton.   
<br />
<br />
  
Q3: Que retourne `useState(0)` au premier rendu?
<details> 
  <summary>Réponse</summary>

   Un tableau contenant en première position, la valeur d'initialisation (ici 0), et en seconde position la fonction qui permet 
   1. De modifier le `state` de ce composant
   2. De déclencher le rendu de ce composant
</details>
<br />
 
Q4: Que retourne `useState(0)` au deuxième rendu?
<details> 
  <summary>Réponse</summary>

   Un tableau contenant en première position, la valeur actuelle, et en seconde position la fonction qui permet 
   1. De modifier le `state` de ce composant
   2. De déclencher le rendu de ce composant
</details>
<br />
  
## 1.3. Comment React gère les Hooks
Modifier le composant `<App />`, lui ajouter un deuxième `<Counter />` : 
```tsx
function App() {
  return (
    <div>
      <Counter />
      <Counter />
    </div>
  );
}
```
Observer à nouveau combien de composants sont rendus au clic sur chaque bouton.  
Un clic n'affecte que le composant sur lequel il se produit.  
  
Imaginons grossièrement le fonctionnement de React 
React voit le code 
```xml
    <div>
        <Counter />
        <Counter />
    <div />
```
Il sait alors qu'il faudra appeler 2 fois la fonction `Counter()` pour générer les composants. Son fonctionnement pourrait ressembler à ceci : 
```js
// react détermine qu'il faudra générer Counter 2 fois
var component1 = Counter() // Counter() appelle useState(0)
var component2 = Counter() // Counter() appelle useState(0)

// Imaginons l'implémentation de useState()
function useState(initialValue){
    // Il faut retourner la variable de state du composant, et le setter
    // Mais comment sait-on de quel composant faut-il renvoyer la variable de state?
}
```
Q5 : Comment React fait-il pour déterminer quel state gérer dans `useState()`?  

<details> 
  <summary>Réponse</summary>

React stocke le nom du composant qu'il va traiter, pour que `useState` l'identifie. On peut imaginer l'implementation suivante
```js
// Au démarrage de l'appli
var states = {}

// A chaque rendu
var currentComponent = "component1"
var component1 = Counter() // appelle useState()
currentComponent = "component2"
var component2 = Counter() // appelle useState()

function useState(initialValue){
    if(states[currentComponent]===undefined){
        // Le state n'existe pas, c'est le 1er rendu
        states[currentComponent] = initialValue
        // Maintenant states = { "component1" : initialValue}
        return [
             // useState retourne la valeur de counter
            initialValue,
            // et la fonction setCounter()
            (value) => { 
                states[currentComponent]=value 
                // update current Component
            }
        ]
    }else{
        // C'est un update du composant
        return [
            // On ne retourne pas initialValue, mais la valeur actuelle du state
            states[currentComponent],
            // Et la meme fonction setCounter()
            (value) => { 
                states[currentComponent]=value 
                // update current Component
            }
        ]
    }
}
```
Et si le `Counter` devient un composant un peu plus complexe et qu'il utilise plusieurs `useState`
```tsx
   import React, {useState} from 'react'
    // Le bouton switch entre noir et blanc a chaque clic
    const Counter : React.FC = () => {
        console.log('Counter renders')
        const [counter, setCounter] = useState(0)
        const [bgColor, setBgColor] = useState('black')
        return <div>
            <p>Vous avez cliqué {counter} fois</p>
            <button 
                style={{backgroundColor : bgColor}} 
                onClick={()=> {
                    setCounter(counter+1) 
                    setBgColor(bgColor==='black'?'white':'black')
                }}
            >Incrementer</button>
        </div>
    }
    export default Counter
```
Dans l'exemple precedent, useState ne gerait qu'une seule variable de state par composant. La fonction peut en réalité en gérer plusieurs, et l'implémentation ressemblerait à ceci
```js
// Au démarrage de l'appli
var states = {}

// A chaque rendu
var currentComponent = "component1"
var currentStateIndex = 0;
var component1 = Counter() // appelle useState() 2 fois
currentComponent = "component2"
currentStateIndex = 0;
var component2 = Counter() // appelle useState() 2 fois

function useState(initialValue){
    // Le state n'existe pas, c'est le 1er rendu
    if(state[currentComponent]===undefined){
        states[currentComponent] = []
    }
    if(states[currentComponent][currentStateIndex]===undefined){
        states[currentComponent].push(initialValue)
        // Apres les 2 appels de useState states = { "component1" : [0, 'black']}
        return [
            initialValue,
            (value) => { 
                states[currentComponent][currentStateIndex]=value 
                // update current Component
            }
        ]
    }else{
        return [
            states[currentComponent][currentStateIndex],
            (value) => { 
                states[currentComponent][currentStateIndex]=value 
                // update current Component
            }
        ]
    }
    currentStateIndex++;
}
```
[Stackoverflow](https://stackoverflow.com/questions/53974865/how-do-react-hooks-determine-the-component-that-they-are-for) fournit une explication plus détaillée, rigoureuse et sourcée
</details>
<br />
  
# 2. useEffect()
## 2.1. Un Function Component qui souscrit à des événements
Soit le composant Todo qui récupère un objet Todo d'une API et l'affiche
```tsx
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
```
Observer la console. Le nombre de `update time` affiché augmente exponentiellement.  
Pourquoi?
<details> 
  <summary>Réponse</summary>
    
Chaque `setTime()` déclenche un rendu, React exécute la fonction Clock() et crée une nouvelle `subscription` qui s'ajoutera à la `subscription` précédemment créée
</details>  
<br />

## 2.2. useEffect()
Le hook useEffect résoud ce problème : 

```tsx
import React, { useState, useEffect } from 'react'
import { interval } from 'rxjs'

const Clock = () => {
    const [time, setTime] = useState('')

    // useEffect prend en paramètre une fonction qui ne sera actualisée qu'au premier rendu de Clock() (équivalent de componentDidMount())
    useEffect(() => {
        interval(1000).subscribe(() => {
            console.log('update time')
            setTime(new Date().toLocaleTimeString())
        })
    }, [])
    return <p>
            Il est {time}
        </p>
}
export default Clock;
```
## 2.3. Eviter les fuites mémoires
Imaginons maintenant que le composant `Clock` ne soit pas en permanence affiché  :
```tsx
import React, { useState } from 'react';
import './App.css';
import Clock from './Clock';

function App() {
  const [showClock, setShowClock] = useState(true)
  return (
    <div>
        <button
        onClick={() => setShowClock(!showClock)}>
        {showClock ? 'Cacher' : 'Afficher'} l'horloge
        </button>
      {
        showClock &&
        <Clock />
      }
    </div>
  );
}

export default App;
```
Essayer de cacher l'horloge (ça va démonter le composant de `<App>`). Dans la console, on observe que les `update time` continuent, et on a ce message : 
```
Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
```
Qu'est-ce que cela signifie? 
<details> 
  <summary>Réponse</summary>
    
La subscription a `interval(1000)` continue, dans son callback elle exécute un `setTime()` sur `Clock` alors que ce dernier est démonté. D'où le warning de React.
</details>  
<br />
  
La doc de `useEffect()` nous indique que le callback qu'elle prend en paramètre peut retourner la fonction qui permettra d'annuler les `subscription` effectuée.  
En pratique : 
```tsx
import React, { useState, useEffect } from 'react'
import { interval } from 'rxjs'

const Clock = () => {
    const [time, setTime] = useState('')

    // useEffect prend en paramètre une fonction qui ne sera actualisée qu'au premier rendu de Clock() (équivalent de componentDidMount())
    useEffect(() => {
        // Enregistrer la subscription dans une variable pour ensuite pouvoir s'en desinscrire
        const subscription = interval(1000).subscribe(() => {
            console.log('update time')
            setTime(new Date().toLocaleTimeString())
        })
        // Retourner la fonction qui permet de se desinscrire de la subscription
        return () => subscription.unsubscribe()
    }, [])
    return <p>
            Il est {time}
        </p>
}
export default Clock;
```
## 2.4. Conditionner useEffect()
Imaginons que l'on souhaite gérer la fréquence de rafraichissement de l'horloge : 

```tsx
import React, { useState, useEffect } from 'react'
import { interval } from 'rxjs'

const Clock = () => {
    const [time, setTime] = useState('')
    const [refreshPeriod, setRefreshPeriod] = useState(1)

    useEffect(() => {
        // La frequence de rafraichissement est modifiee ici
        const subscription = interval(1000 * refreshPeriod).subscribe(() => {
            console.log('update time')
            setTime(new Date().toLocaleTimeString())
        })
        return () => subscription.unsubscribe()
    }, [])
    return <>
        <p>
            Il est {time}
        </p>
        <input
            type="number"
            value={refreshPeriod}
            onChange={e => setRefreshPeriod(+e.target.value)} />
    </>
}
export default Clock;
```
Les changements dans l'input n'ont aucun effet sur la fréquence de l'horloge.  
Pourquoi?
<details> 
  <summary>Réponse</summary>
     
Le callback de `useEffect` n'est exécuté qu'au montage du composant
</details>  
<br />

Le 2nd paramètre de `useEffect()`, auquel nous avons donnée la valeur `[]`, représente le tableau de dépendance. C'est à dire que le callback sera executé à chaque fois que ce tableau changera.  
En lui donnant la valeur `[refreshPeriod]`, useEffect saura qu'il faut ré-exécuter le callback.
```ts
    useEffect(() => {
        // La frequence de rafraichissement est modifiee ici
        const subscription = interval(1000 * refreshPeriod).subscribe(() => {
            console.log('update time')
            setTime(new Date().toLocaleTimeString())
        })
        return () => subscription.unsubscribe()
    }, [refreshPeriod])
```
# 3. useContext()
