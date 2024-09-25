import { ThemeContext } from "./App";
import { useContext } from "react";

export function ThemeButton({theme}){
    let themeProps = useContext(ThemeContext);
    let setTheme = themeProps.setTheme;

    function updateTheme(){
        if (themeProps.theme !== theme){
            setTheme(theme);
        }
    }

    return <button onClick={updateTheme}>{theme}</button>
}




