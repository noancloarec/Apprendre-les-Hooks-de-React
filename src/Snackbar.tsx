import React, { useContext, useEffect, useState } from 'react';


const SnackbarContext = React.createContext({ snack: null as JSX.Element | string | null, duration: 1000, triggerSnack: (_: JSX.Element | string | null, duration: number) => { } });


const SnackBar = () => {
    const { snack, duration, triggerSnack } = useContext(SnackbarContext)
    useEffect(() => {
        let isLastSnack = true;
        if (snack && duration) {
            setTimeout(() => {
                if (isLastSnack) {
                    triggerSnack(null, 0)
                }
            }, duration);
        }
        return () => { isLastSnack = false }
    }, [snack, duration])
    return <div className="snackbar">
        {snack}
    </div>
}

export const SnackBarProvider: React.FC<{ children: any }> = ({ children }) => {
    const [snack, setSnack] = useState(null as JSX.Element | null | string)
    const [duration, setDuration] = useState(1000)
    const value = {
        snack, duration, triggerSnack: (el: JSX.Element | string | null, duration: number) => {
            setSnack(el);
            setDuration(duration)
        }
    }

    return <SnackbarContext.Provider value={value}>
        {children}
        <SnackBar />
    </SnackbarContext.Provider>
}

export const useSnackbar = () => {
    const { triggerSnack } = useContext(SnackbarContext)
    return triggerSnack
}

