export default function Creator() {
    return(
        <div className="min-h-screen bg-red-600 grid grid-cols-2 gap-10">
            <div className="p-4 flex flex-col justify-center items-center">
                <div className="border w-full aspect-square rounded-3xl max-w-[600px]"></div>
            </div>
            <div className="p-4 flex flex-col justify-center">
                <div className="w-full">
                    <div>
                        <h2 className="text-white font-bold text-2xl">Lorem, ipsum dolor.</h2>
                        <hr />
                        <div className="flex flex-wrap gap-8 py-4">
                            <div className="max-w-[200px] w-full p-8 rounded-xl border"></div>
                            <div className="max-w-[200px] w-full p-8 rounded-xl border"></div>
                            <div className="max-w-[200px] w-full p-8 rounded-xl border"></div>
                            <div className="max-w-[200px] w-full p-8 rounded-xl border"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}