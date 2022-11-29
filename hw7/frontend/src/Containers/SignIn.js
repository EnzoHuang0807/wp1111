import AppTitle from '../Components/Title'
import LogIn from '../Components/LogIn'
import { useChat } from "./hooks/useChat";

const SignIn = () => {
    const { me, setMe, setSignedIn, displayStatus } = useChat();
    const handleLogin = (name) => {
      if (!name)
        displayStatus({
          type: "error",
          msg: "Missing user name",
        });
      else
        setSignedIn(true)
    }

    return (
      <>
        <AppTitle />
        <LogIn me={me} setName={setMe} onLogin={handleLogin} />
      </>
    );
}

export default SignIn;