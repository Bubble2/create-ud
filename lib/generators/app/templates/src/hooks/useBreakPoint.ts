import { Grid } from 'antd'
const { useBreakpoint } = Grid

export default () => {
    const screens = useBreakpoint()
    const curScreen = Object.entries(screens).filter(screen => !!screen[1])
    console.log('screens', screens)
    const isXsScreen = curScreen.length === 1 && screens.xs
    const isSmScreen = curScreen.length >= 1 && screens.sm
    const isMdScreen = curScreen.length >= 2
    const isLgScreen = curScreen.length >= 3
    const isXlScreen = curScreen.length >= 4
    const isXxlScreen = curScreen.length >= 5
    return {
        isXsScreen,
        isSmScreen,
        isMdScreen,
        isLgScreen,
        isXlScreen,
        isXxlScreen
    }
}
