import Input from "../../components/Input";

const LoginForm = () => {
  return (
    <>
      <form action="#">
        <Input
          label="Username"
          id="username"
          type="text"
          placeholder="Enter username"
        />
        <Input
          label="Password"
          id="password"
          type="password"
          placeholder="Enter password"
        />
        <div className="px-10 my-5">
          <button
            type="submit"
            className="border bg-sky-950 w-full text-white p-3 rounded-2xl font-bold"
          >
            Login
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
