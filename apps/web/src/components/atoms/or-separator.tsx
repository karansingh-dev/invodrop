


export default function OrSeparator(props:{text: string}) {

    return <div className="flex items-center w-full my-1">
        <div className="flex-grow border-t" />
        <span className="mx-4 text-sm">{props.text} </span>
        <div className="flex-grow border-t" />
    </div>
}