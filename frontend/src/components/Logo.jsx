import { Link } from "wouter";
import futureLogo from '/future.svg'

function Logo() {

  return (
    <Link href="/">
      <a><img src={futureLogo} className="logo" alt="future logo" /></a>
    </Link>
  );
}

export default Logo;
