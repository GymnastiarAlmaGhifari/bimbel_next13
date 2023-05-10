import Link from 'next/link'
import React from 'react'

type Props = {}

const index = (props: Props) => {
    return (
        <div>
            anda belum memilih buku untuk di edit

            {/* kembali ke dashboard untuk memilih buku untuk di edit */}
            <Link
                href="/dashboard"
            >
                <button
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                >
                    kembali ke dashboard untuk memilih buku untuk di edit
                </button>
            </Link>
        </div>
    )
}

export default index