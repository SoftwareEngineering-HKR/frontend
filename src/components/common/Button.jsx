import { Link } from "react-router-dom";

export default function Button({ text, to, type="button", onClick}) {

    if (to) {
        return (
            <Link
                type={type}
                to={to}
                className='px-4 py-2 rounded-lg bg-primary text-white'
            >
                {text}
            </Link>
        );
    }

    return (
    <button
        onClick={onClick}
        className='px-4 py-2 rounded-lg bg-primary text-white'
    >
        {text}
    </button>
    )
}