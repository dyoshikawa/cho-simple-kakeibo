import * as React from 'react'
import { initializeApp, auth, firestore, User } from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'bulma'
import '@fortawesome/fontawesome'
import '@fortawesome/fontawesome-free-solid'
import '@fortawesome/fontawesome-free-regular'
import '@fortawesome/fontawesome-free-brands'
import Header from './components/Header'
import AddItem from './components/AddItem'
import ItemList from './components/ItemList'
import { Collections } from './utils/defines'

enum Tabs {
  Items,
  Budget,
}

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
  tab: Tabs
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
  constructor(props: Props) {
    super(props)
    this.state = {
      me: null,
      price: 0,
      items: [],
      tab: Tabs.Items,
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

  onRemoveItemClicked = async (id: string) => {
    if (!this.state.me) return
    await firestore()
      .collection(Collections.items)
      .doc(id)
      .delete()
  }

  onItemsTabClicked = () => {
    this.setState({ tab: Tabs.Items })
  }

  onBudgetTabClicked = () => {
    this.setState({ tab: Tabs.Budget })
  }

  render() {
    return (
      <React.Fragment>
        <Header
          me={this.state.me}
          onLoginClicked={this.onLoginClicked}
          onLogoutClicked={this.onLogoutClicked}
        />

        {this.state.me && (
          <React.Fragment>
            <AddItem me={this.state.me} />
            <div className="container">
              <div className="tabs">
                <ul>
                  <li
                    className={this.state.tab === Tabs.Items ? 'is-active' : ''}
                  >
                    <a onClick={this.onItemsTabClicked}>支出一覧</a>
                  </li>
                  <li
                    className={
                      this.state.tab === Tabs.Budget ? 'is-active' : ''
                    }
                  >
                    <a onClick={this.onBudgetTabClicked}>予算</a>
                  </li>
                </ul>
              </div>
            </div>
            <ItemList
              items={this.state.items}
              onRemoveItemClicked={this.onRemoveItemClicked}
            />
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }
}

export default App
