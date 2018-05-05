import React, { Component } from 'react';
import LLTE from './LLTE'
import './Menu.css';
import './buttons.css';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            log: '',
            opts: {
                removeDecrSubmits: true,
                hideUsers: true,
                freezeTime: 0
            }
        };

        this.onLogChange = this.onLogChange.bind(this);
        this.importYaContest = this.importYaContest.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.generateLLTE = this.generateLLTE.bind(this);
    }

    onLogChange(e) {
        this.setState({ log: e.target.value });
    }

    importYaContest() {
        const log = this.state.log;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(log, 'text/xml');

        const contest = {};

        const get = (tag) => xmlDoc.getElementsByTagName(tag)[0];
        const val = (element) => element.childNodes[0].nodeValue;

        const xmlLog = get('contestLog');
        const xmlContestName = get('contestName');
        const xmlProblems = get('problems').getElementsByTagName('problem');
        const xmlUsers = get('users').getElementsByTagName('user');
        const xmlSubmits = get('events').getElementsByTagName('submit');

        contest.infoGenerationTime = xmlLog.getAttribute('generationTime');
        contest.name = val(xmlContestName);
        
        contest.problems = [];
        for (let i = 0; i < xmlProblems.length; i++) {
            const node = xmlProblems[i];
            contest.problems.push({
                title: node.getAttribute('title'),
                longName: node.getAttribute('longName')
            });
        }

        contest.users = [];
        for (let i = 0; i < xmlUsers.length; i++) {
            const xmlUser = xmlUsers[i];
            const user = {
                id: xmlUser.getAttribute('id'),
                loginName: xmlUser.getAttribute('loginName'),
                displayedName: xmlUser.getAttribute('displayedName'),
                hidden: xmlUser.getAttribute('participationType') === 'HIDDEN'
            };
            contest.users.push(user);
        }

        contest.submits = [];
        for (let i = 0; i < xmlSubmits.length; i++) {
            const xmlSubmit = xmlSubmits[i];
            const submit = {
                contestTime: xmlSubmit.getAttribute('contestTime'),
                absoluteTime: xmlSubmit.getAttribute('absoluteTime'),
                id: xmlSubmit.getAttribute('id'),
                problemTitle: xmlSubmit.getAttribute('problemTitle'),
                userId: xmlSubmit.getAttribute('userId'),
                verdict: xmlSubmit.getAttribute('verdict'),
                score: xmlSubmit.getAttribute('score')
            };
            contest.submits.push(submit);
        }

        this.props.updateContest(contest);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            opts: {
                [name]: value
            }
        });
    }

    generateLLTE() {
        this.props.updateLLTE(LLTE.generate(this.props.contest, this.state.opts));
    }

    render() {
        return (
            <div className="Menu">
                <h4>Insert XML log here:</h4>
                <textarea className="Menu-log-area" value={this.state.log} onChange={this.onLogChange} />
                <br/>
                <button className="nice-button" onClick={this.importYaContest}>Import Ya.Contest log</button>

                <br/>

                <h4>Generate LLTE</h4>
                <label>
                    Remove decreasing points submits: (show best submit)
                    <input 
                        name="removeDecrSubmits"
                        type="checkbox"
                        checked={this.state.opts.removeDecrSubmits}
                        onChange={this.handleInputChange}
                    />
                </label>
                <br/>
                <label>
                    Hide hidden users:
                    <input 
                        name="hideUsers"
                        type="checkbox"
                        checked={this.state.opts.hideUsers}
                        onChange={this.handleInputChange}
                    />
                </label>
                <br/>
                <label>
                    Freeze time:
                    <input 
                        name="freezeTime"
                        type="number"
                        checked={this.state.opts.freezeTime}
                        onChange={this.handleInputChange}
                    />
                </label>
                <br/>
                <button className="nice-button" onClick={this.generateLLTE}>Generate LLTE</button>

                <h4>LLTE:</h4>
                <pre className="Menu-contest-code">
                    <code>
                        {JSON.stringify(this.props.llte, null, 4)}
                    </code>
                </pre>

                <h4>Contest code:</h4>
                <pre className="Menu-contest-code">
                    <code>
                        {JSON.stringify(this.props.contest, null, 4)}
                    </code>
                </pre>
            </div>
        )
    }
}

export default Menu;