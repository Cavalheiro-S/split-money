import { ConfigProvider } from "antd";

interface Props {
    children: React.ReactNode;
}

export const AntDesignProvider = ({ children }: Props) => {

    return (
        <ConfigProvider theme={{
            token: {
                colorPrimary: "#00B528",
            },
            
        }}>
            {children}
        </ConfigProvider>
    )

}