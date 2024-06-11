import './styles.css'

const Loader = ({ info }) => {
    return <>
        <span className="loader" />
        {info && <p>{info}</p>}
    </>
}

export default Loader;
