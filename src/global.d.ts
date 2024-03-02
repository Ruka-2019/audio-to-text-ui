// global.d.ts
export {};

declare global {
    interface Window {
        electronAPI: {
            closeWindow: () => void;
            minimizeWindow: () => void;
            maximizeWindow: () => void;
            toggleMaximizeWindow: () => void;
            isElectron: () => false;
        };
    }
}
