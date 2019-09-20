import React from "react";
import PropTypes from "prop-types";
import { fetchPopularRepos } from "../utils/api";

function LanguagesNav({ selected, onUpdateLanguage }) {
	const languages = ["All", "Javascript", "Ruby", "Java", "CSS", "Python"];
	return (
		<ul className="flex-center">
			{languages.map(language => (
				<li key={language}>
					<button
						className="btn-clear nav-link"
						style={language === selected ? { color: "rgb(187, 46, 31)" } : null}
						onClick={() => onUpdateLanguage(language)}
					>
						{language}
					</button>
				</li>
			))}
		</ul>
	);
}

LanguagesNav.propTypes = {
	selected: PropTypes.string.isRequired,
	onUpdateLanguage: PropTypes.func.isRequired
};

function ReposGrid({ repos }) {
	return <ul className="grid"></ul>;
}

ReposGrid.propTypes = {
	repos: PropTypes.array.isRequired
};

export default class Popular extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedLanguage: "All",
			repos: {},
			error: null
		};
		this.updateLanguage = this.updateLanguage.bind(this);
		this.isLoading = this.isLoading.bind(this);
	}
	componentDidMount() {
		this.updateLanguage(this.state.selectedLanguage);
	}
	updateLanguage(selectedLanguage) {
		this.setState({
			selectedLanguage,
			error: null
		});

		if (!this.state.repos[selectedLanguage]) {
			fetchPopularRepos(selectedLanguage)
				.then(data =>
					this.setState(({ repos }) => ({
						repos: {
							...repos,
							[selectedLanguage]: data
						}
					}))
				)
				.catch(error => {
					console.warn("Error fetching repos", error);
					this.setState({
						error: "There was an error fetching the repositories."
					});
				});
		}
	}
	isLoading() {
		const { selectedLanguage, repos, error } = this.state;
		return !repos[selectedLanguage] && error === null;
	}
	render() {
		const { selectedLanguage, repos, error } = this.state;
		return (
			<React.Fragment>
				<LanguagesNav
					selected={selectedLanguage}
					onUpdateLanguage={this.updateLanguage}
				/>
				{this.isLoading() && <p>loading</p>}
				{error && <p>{error}</p>}
				{repos[selectedLanguage] && (
					<ReposGrid repos={repos[selectedLanguage]} />
				)}
				{/* {repos[selectedLanguage] && <pre>{JSON.stringify(repos[selectedLanguage], null, 2)}</pre>} */}
			</React.Fragment>
		);
	}
}
