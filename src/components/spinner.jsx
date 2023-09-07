import Image from 'next/image';
import loader from '@/components/loader.png'

const LoadingSpinner = () => {
    return (
        <>
            <div className="flex justify-center items-center w-full h-screen">
                <Image className='animate-spin' src={loader} width={50} height={50} alt=''/>
            </div>
        </>
    )
}

export default LoadingSpinner;