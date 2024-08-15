import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Container } from "@mui/material";
import { useWebAppStore } from "@/store/WebAppStore";
import GuestLogin from "@/lib/api-client/GuestLogin";
import UserAccountLoginResponse from "@/models/UserAccountLoginResponse";
import { NEXTAUTH_PROVIDER_ID } from "../webapp.config";

interface Props {
	requireLogin?: boolean;
	children: JSX.Element | JSX.Element[];
}

export default function PageContainer(props: Props) {
	const { requireLogin, children } = props;

	const { data: authSession, status } = useSession();
	const { apiToken, setApiToken } = useWebAppStore();
	const [loading, setLoading] = useState<boolean>(false);

	/** get access token for guest user */
	async function getGuestAccessToken() {
		if (loading) return;

		setLoading(true);

		try {
			const tokens : UserAccountLoginResponse = await GuestLogin();
			const accessToken = tokens.tokens?.accessToken ?? "";
			setApiToken(accessToken);
			console.log("getGuestAccessToken: userId = " + tokens.data?.id);
			console.log("getGuestAccessToken: accessToken = " + accessToken);
		} catch(err) {
			console.log("getGuestAccessToken: ERROR!! " + err);
		}

		setLoading(false);
	}

	useEffect(() => {
		// console.log("authSession", authSession);
		if (authSession === undefined) {
			// console.log("authSession is undefined");
		} else if (authSession === null) {
			getGuestAccessToken();
		}
	}, [authSession]);

	// useEffect(() => {
	// 	console.log("apiToken: ", apiToken);
	// }, [apiToken]);

	if (requireLogin && !authSession && (status != "loading")) {
		signIn(NEXTAUTH_PROVIDER_ID);
		return <></>;
	}

	return (
		<Container
			maxWidth={false}
			style={{
				display: "flex",
				flexDirection: "column",
				padding: 0,
				// paddingBottom: 10,
			}}
		>
			{children}
		</Container>
	);
};
