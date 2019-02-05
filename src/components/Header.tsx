import * as React from 'react'
import { User } from 'firebase/app'

interface Props {
  me: User | null
  onLoginClicked: () => void
  onLogoutClicked: () => Promise<any>
}

const Header: React.FC<Props> = props => (
  <React.Fragment>
    <section className="hero is-info">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">超シンプル家計簿</h1>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <h2 className="subtitle">
          煩わしい入力項目のない<strong>超シンプルな家計簿</strong>
          です。
        </h2>
        {props.me === null && (
          <button className="button is-info" onClick={props.onLoginClicked}>
            <i className="fa-google fab" />
            &nbsp; Googleアカウントでログイン
          </button>
        )}
        {props.me !== null && (
          <button className="button is-danger" onClick={props.onLogoutClicked}>
            ログアウト
          </button>
        )}
      </div>
    </section>
  </React.Fragment>
)

export default Header
