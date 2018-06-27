import React from 'react';
import ReactDOM from 'react-dom';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import Button from '@material-ui/core/Button';
import PublishIcon from '@material-ui/icons/Publish';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return {
    username: state.username,
    usersInRoom: state.usersForNewRoom,
  };
};

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class ConnectedLiveChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: '',
    };

    //
    // ─── RANDOMIZE NAMES ─────────────────────────────────────────────
    //
    const aliases = ['HAL 9000',
      'Android 18',
      'AM',
      'Marvin',
      'Roy Batty',
      'Pris',
      'Rachael',
      'C-3PO',
      'Ash',
      'T-800',
      'T-1000',
      'Data',
      'Bishop',
      'Johnny 5',
      'Robocop',
      'Rosie',
      'Cortana',
      'HK-47',
      '2B',
      'GlaDOS',
      'SHODAN',
      'Dolores'];
    this.userAliases = this.props.usersInRoom.reduce((obj, user) => {
      obj[user] = aliases[Math.floor(Math.random() * aliases.length)];
      return obj;
    }, {});
    this.userAliases["Mitsuku"] = aliases[Math.floor(Math.random() * aliases.length)];
    // ─────────────────────────────────────────────────────────────────
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  updateMessage(e) {
    this.setState({
      msg: e.target.value,
    });
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(this.props.messages) !== JSON.stringify(prevProps.messages)) {
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    const scrollHeight = this.messageList.scrollHeight;
    const height = this.messageList.clientHeight;
    const maxScrollTop = scrollHeight - height;
    ReactDOM.findDOMNode(this.messageList).scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }

  handleKeyPress(event) {
    if (event.key == 'Enter') {
      if (this.state.msg) this.props.sendMessage(this.state.msg);
      this.setState({
        msg: ''
      })
    }
  }

  handleClick() {
    if (this.state.msg) this.props.sendMessage(this.state.msg);
    this.setState({
      msg: ''
    })
  }

  render() {
    const { classes } = this.props;
    return (
      <Paper
        id="chat-window"
        style={{ backgroundColor: 'rgba(255,255,255,.1)' }}>

        {/* TOP BAR */}
        <div className={classes.root}>
          <AppBar position="static" color="default">
            <Toolbar>
              <Typography variant="title" color="inherit" className={classes.flex}>
                {this.props.roomName}
              </Typography>
              <Typography variant="title" color="inherit">
                {this.props.timer}
              </Typography>
            </Toolbar>
          </AppBar>
        </div>

        {/* MESSAGE LIST */}
        <div className="chat-messages" ref={(el) => { this.messageList = el; }}>
          {this.props.messages.map(message => {
            if (this.props.username === message.name) {
              return (<div className="section"
                style={{ textAlign: "right", borderTop: "1px solid black", padding: "17px", fontSize: "18px" }}>
                <p>{message.message}</p>
              </div>)
            } else {
              return (<div className="section"
                style={{ textAlign: "left", borderTop: "1px solid black", padding: "17px", fontSize: "18px" }}>
                <p><strong>{this.userAliases[message.name]}:&nbsp;</strong>{message.message}</p>
              </div>)
            }
          })}
        </div>

        {/* BOTTOM BAR */}
        <BottomNavigation
          onChange={this.handleChange}
          showLabels>
          <FormControl style={{ width: '70%' }}>
            <Input
              style={{ marginTop: '10px' }}
              fullWidth
              margin="normal"
              value={this.state.msg}
              onChange={this.updateMessage.bind(this)}
              onKeyPress={this.handleKeyPress.bind(this)}
            />
          </FormControl>
          <Button variant="fab" color="primary" aria-label="add" className={classes.button}
            onClick={this.handleClick.bind(this)}>
            <PublishIcon />
          </Button>
        </BottomNavigation>
      </Paper>
    );
  }
}

const LiveChat = connect(mapStateToProps)(ConnectedLiveChat);

export default withStyles(styles)(LiveChat);