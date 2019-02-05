import * as React from 'react'
import { firestore, User } from 'firebase/app'
import moment from 'moment'
import { Collections } from '../utils/defines'

interface Props {
  me: User | null
}
interface State {
  price: number
}

class AddItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      price: 0,
    }
  }

  priceInputRef = React.createRef<HTMLInputElement>()

  onAddItemClicked = async () => {
    if (!this.props.me || this.state.price === 0) return
    await firestore()
      .collection(Collections.items)
      .add({
        price: this.state.price,
        userUid: this.props.me.uid,
        createdAt: moment().format('YYYY/MM/DD HH:mm:ss'),
      })
    this.setState({ price: 0 })
    if (this.priceInputRef.current) this.priceInputRef.current.value = ''
  }

  onPriceChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ price: Number(e.target.value) })
  }

  render() {
    return (
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
    )
  }
}
export default AddItem
