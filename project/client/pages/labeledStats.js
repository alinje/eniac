import Link from 'next/link'

export default function LabeledStats() {
    return (
        <>
            <h1>First Page</h1>
            <h2>
                <Link href="/">
                    <a>Back to home</a>
                </Link>
            </h2>
        </>
    )
}