import { PropsWithChildren } from "react";

interface PageContainerProps extends PropsWithChildren{}

export default function PageContainer({children}: PageContainerProps) {
	return (
		<div style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1
        }}>
            {children}
		</div>
	);
};
