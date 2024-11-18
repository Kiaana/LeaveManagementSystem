import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex space-x-4">
        <Link href="/">
          <a className="text-white">首页</a>
        </Link>
        <Link href="/leave_request">
          <a className="text-white">请假申请</a>
        </Link>
        <Link href="/cancel_leave">
          <a className="text-white">销假申请</a>
        </Link>
        <Link href="/overview">
          <a className="text-white">信息总览</a>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;