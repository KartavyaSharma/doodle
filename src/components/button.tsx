import "./button.css"

export default function Button(props: { children: React.ReactNode, color?: string, fontSize?: string, onClick: () => void }) {
    return (
        <button 
            className={`button button-${props.color || 'default'}`} 
            style={{fontSize: props.fontSize || '30px'}}
            onClick={props.onClick}
        >{props.children}</button>
    )
}