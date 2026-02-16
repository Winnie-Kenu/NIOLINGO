import { useCallback } from "react";

export const useHaptics = () => {
    const triggerSuccess = useCallback(() => {
        if (window.navigator && window.navigator.vibrate) {
            // Success pattern: short double pulse
            window.navigator.vibrate([10, 30, 10]);
        }
    }, []);

    const triggerError = useCallback(() => {
        if (window.navigator && window.navigator.vibrate) {
            // Error pattern: single long heavy pulse
            window.navigator.vibrate(200);
        }
    }, []);

    const triggerClick = useCallback(() => {
        if (window.navigator && window.navigator.vibrate) {
            // Light click
            window.navigator.vibrate(5);
        }
    }, []);

    const triggerTrophy = useCallback(() => {
        if (window.navigator && window.navigator.vibrate) {
            // Trophy/Win pattern: sequence of pulses
            window.navigator.vibrate([50, 50, 100, 50, 150]);
        }
    }, []);

    return { triggerSuccess, triggerError, triggerClick, triggerTrophy };
};
