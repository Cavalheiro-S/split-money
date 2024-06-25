import { Spin } from "antd";

export default function Loading() {
    return (
        <div className='flex flex-col items-center justify-center gap-4'>
            <Spin />
            <h3 className='font-sans font-normal text-primary'>Carregando ...</h3>
        </div>
    )
}