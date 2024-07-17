import { ConfigProvider } from "antd";
import ptBR from 'antd/lib/locale/pt_BR';
interface Props {
    children: React.ReactNode;
}

export const AntDesignProvider = ({ children }: Props) => {

    return (
        <ConfigProvider
            locale={ptBR}
            theme={{
                token: {
                    colorPrimary: "#00B528",
                }
            }}
        >
            {children}
        </ConfigProvider>
    )

}