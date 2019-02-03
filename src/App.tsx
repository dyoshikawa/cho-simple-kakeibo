import * as React from 'react'
import { initializeApp, auth, firestore, User } from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import moment from 'moment'
import 'bulma'

interface Item {
  id: string
  price: number
  userUid: string
  createdAt: string
}

interface Props {}

interface State {
  price: number
  me: User | null
  items: Item[]
}

const Collections = {
  items: 'items',
}

const firebaseInit = () => {
  initializeApp({
    apiKey: 'AIzaSyBt3ArI0QdzN5cNIYUyJDmKjWSMXpDrVR0',
    authDomain: 'cho-simple-kakiebo.firebaseapp.com',
    databaseURL: 'https://cho-simple-kakiebo.firebaseio.com',
    projectId: 'cho-simple-kakiebo',
    storageBucket: 'cho-simple-kakiebo.appspot.com',
    messagingSenderId: '896702567226',
  })
}

const fetchMe = async (): Promise<User | null> => {
  return new Promise(resolve => {
    auth().onAuthStateChanged(user => {
      if (user) {
        console.log(`Your uid: ${user.uid}`)
        return resolve(user)
      } else {
        console.log('You are guest.')
        return resolve(null)
      }
    })
  })
}

class App extends React.Component<Props, State> {
  priceInputRef = React.createRef<HTMLInputElement>()

  constructor(props: Props) {
    super(props)
    this.state = {
      me: null,
      price: 0,
      items: [],
    }
  }

  componentDidMount = async () => {
    firebaseInit()

    const me = await fetchMe()
    this.setState({ me: me })

    if (!me) return
    firestore()
      .collection(Collections.items)
      .where('userUid', '==', me.uid)
      .onSnapshot(snapShot => {
        const items: Item[] = snapShot.docs.map(doc => ({
          id: doc.id,
          price: doc.data().price as number,
          userUid: doc.data().userUid as string,
          createdAt: doc.data().createdAt as string,
        }))
        items.sort((a, b) => {
          if (a.createdAt > b.createdAt) return -1
          if (a.createdAt < b.createdAt) return 1
          return 0
        })
        this.setState({ items: items })
      })
  }

  onLoginClicked = () => {
    auth().signInWithRedirect(new auth.GoogleAuthProvider())
  }

  onLogoutClicked = async () => {
    await auth().signOut()
    this.setState({ me: null })
  }

  onAddItemClicked = async () => {
    if (!this.state.me || this.state.price === 0) return
    await firestore()
      .collection(Collections.items)
      .add({
        price: this.state.price,
        userUid: this.state.me.uid,
        createdAt: moment().format('YYYY/MM/DD hh:mm:ss'),
      })
    this.setState({ price: 0 })
    if (this.priceInputRef.current) this.priceInputRef.current.value = ''
  }

  onPriceChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ price: Number(e.target.value) })
  }

  render() {
    return (
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
            {this.state.me === null && (
              <button className="button is-info" onClick={this.onLoginClicked}>
                Googleアカウントでログイン
              </button>
            )}
            {this.state.me !== null && (
              <button
                className="button is-danger"
                onClick={this.onLogoutClicked}
              >
                ログアウト
              </button>
            )}
          </div>
        </section>

        {this.state.me && (
          <React.Fragment>
            <section className="section">
              <div className="container">
                <div className="field is-grouped">
                  <p className="control is-expanded">
                    <input
                      type="number"
                      className="input"
                      placeholder="金額"
                      ref={this.priceInputRef}
                      onChange={this.onPriceChanged}
                    />
                  </p>
                  <p className="control">
                    <button
                      className="button is-info"
                      onClick={this.onAddItemClicked}
                    >
                      登録
                    </button>
                  </p>
                </div>
              </div>
            </section>

            <section className="section">
              <div className="container">
                {this.state.items.map(item => (
                  <div className="card" key={item.id}>
                    <div className="card-content">
                      <p className="title">{item.price}円</p>
                      <p className="subtitle">{item.createdAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }
}

export default App
