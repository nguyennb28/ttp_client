import Input from "../../components/Input";

const LoginForm = () => {
  return (
    <>
      <form action="#" className="flex flex-col px-1">
        <Input
          label="Tài khoản"
          id="username"
          type="text"
          placeholder="Nhập tài khoản"
        />
        <Input
          label="Mật khẩu"
          id="password"
          type="password"
          placeholder="Nhập mật khẩu"
        />
      </form>
    </>
  );
};

export default LoginForm;
