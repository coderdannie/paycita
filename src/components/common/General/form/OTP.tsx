// import { COLORS } from "@/constants/colors";
import OtpInput from "react-otp-input";
import { COLORS } from "../../colors";

const OTP = ({ OTP, setOTP, length }: iOTP) => {
	return (
		<>
			<OtpInput
				value={OTP}
				onChange={setOTP}
				numInputs={length ?? 4}
				renderSeparator={<span> </span>}
				inputStyle={{
					width: "100%",
					height: 80,
					backgroundColor: "#E6F2FC66",
					borderWidth: "2px",
					borderColor: COLORS.sec,
					borderRadius: 10,
					margin: 6,
					fontSize: 20,
					fontWeight: "bold",
					color: COLORS.pry,
				}}
				renderInput={(props) => <input {...props} />}
			/>
		</>
	);
};

export default OTP;
