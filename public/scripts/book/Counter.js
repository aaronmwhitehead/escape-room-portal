const Button = (props) => {
    return (
        <div className="counter-box counter-btn" onClick={() =>
            props.sign == "+" ? props.updateCount(1) : props.updateCount(-1)} >
            {props.sign == "+" ? <i className="fas fa-plus"></i> : <i className="fas fa-minus"></i>}
        </div>

    );
}

class Counter extends React.Component {

    constructor(props) {
        super(props);
        this.resetState = this.resetState.bind(this);
        this.state = {
            count: 1, 
            max: 5
        }
    }

    componentDidMount() {
        document.querySelectorAll('.btn-time').forEach((elem) => {
            if (![...elem.classList].includes('not-available')) {
                elem.addEventListener('click', this.resetState);
            }
        });
        document.querySelector('.fa-minus').parentElement.classList.add('disabled');
    }

    resetState() {
        this.setState({ count: 1 })
        document.querySelector('.fa-plus').parentElement.classList.remove('disabled');
        document.querySelector('.fa-minus').parentElement.classList.add('disabled');
    }

    handleCount(value) {
        const active = document.querySelector('.active');
        if(!active) {
            document.querySelector('.time-err').style.opacity = '1';
            $('.time-err').fadeIn('fast').delay(2000).fadeOut('slow', () => {
                document.querySelector(`.time-err`).style.display = 'block';
                document.querySelector(`.time-err`).style.opacity = '0';
            });
            return;
        }

        var availability = active.dataset.available;
        
        if (value === 1 && this.state.count < availability) {
            this.setState((prevState) => ({ count: prevState.count + value }));
        } else if (value === -1 && this.state.count > 1) {
            this.setState((prevState) => ({ count: prevState.count + value }));
        }

        if (value === 1 && this.state.count >= availability - 1) {
            document.querySelector('.fa-plus').parentElement.classList.add('disabled');
        } else {
            document.querySelector('.fa-plus').parentElement.classList.remove('disabled');
        }

        if (value === -1 && this.state.count <= 2) {
            document.querySelector('.fa-minus').parentElement.classList.add('disabled');
        } else {
            document.querySelector('.fa-minus').parentElement.classList.remove('disabled');
        }

    }

    render() {
        return (
            <div className="counter">
                <Button sign="-" count={this.state.count} updateCount={this.handleCount.bind(this)} />
                <span className="counter-box counter-value" data-value={this.state.count}>{this.state.count}</span>
                <Button sign="+" count={this.state.count} updateCount={this.handleCount.bind(this)} />
            </div>
        );
    }
}

ReactDOM.render(<Counter />, document.getElementById('react-counter'));