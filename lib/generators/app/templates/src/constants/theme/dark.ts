import { theme, ThemeConfig } from "antd";

const themeConfig: ThemeConfig = {
    algorithm: theme.darkAlgorithm,
    token: {
        colorPrimary: "#246cf9",
        colorPrimaryText: "#246cf9",
        colorText: 'rgba(255, 255, 255, 1)',
        colorTextSecondary: 'rgba(255, 255, 255, 0.85)',
        colorTextTertiary: 'rgba(255, 255, 255, 0.65)',
        colorTextQuaternary: 'rgba(255, 255, 255, 0.45)',
        colorBgElevated: 'rgba(47, 50, 65, 1)'
    },
    components: {
        Button: {
            borderRadius: 7,
            colorBgContainer: 'transparent',
            colorPrimaryBg: 'linear-gradient(90deg, #246CF9 0%, #00A3FF 100%)'
        },
        Table: {
            colorBgContainer: 'transparent',
            colorBorderSecondary: '#3A3F51',
        },
        Modal: {
            colorBgElevated: '#1A1D28'
        },
        Select: {
            colorBgContainer: 'rgba(47, 50, 65, 0.5)',
            colorBorder: '#34384C',
            colorBgElevated: 'rgba(47, 50, 65, 1)'
        },
        Input: {
            colorBgContainer: '#252838',
            colorBorder: '#34384C'
        },
        InputNumber: {
            colorBgContainer: 'rgba(47, 50, 65, 0.5)',
            colorBorder: '#34384C'
        },
        DatePicker: {
            colorBgContainer: 'rgba(47, 50, 65, 0.5)',
            colorBorder: '#34384C',
            colorBgElevated: 'rgba(47, 50, 65, 1)'
        },
        Menu: {
            colorItemTextSelected: '#246CF9'
        },
        Radio: {
            colorBgContainer: 'rgba(47, 50, 65, 0.5)',
        }
    }
}

export default themeConfig