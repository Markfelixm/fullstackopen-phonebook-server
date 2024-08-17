const Notification = ({ notification }) => {
	const style = {
		color: notification.color,
		background: "lightgrey",
		fontSize: "20px",
		borderStyle: "solid",
		borderRadius: "5px",
		padding: "10px",
		marginBottom: "10px",
	};

	if (notification.message === null) {
		return null;
	}

	return (
		<div className="error" style={style}>
			{notification.message}
		</div>
	);
};

export default Notification;
