import "./modal.css"

export default function Modal(props: { children: React.ReactNode, onClickOut?: () => void }) {

    return (
        <div className="modalContainer" onClick={props.onClickOut}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                {props.children}
            </div>
        </div> 
    )
}