import * as React from 'react'
import { firestore, User } from 'firebase/app'
import moment from 'moment'
import { Collections } from '../utils/defines'

interface Props {
  me: User | null
}
interface State {
  budget: number
}

class RegisterBudget extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      budget: 0,
    }
  }

  budgetInputRef = React.createRef<HTMLInputElement>()

  onRegisterBudgetClicked = async () => {
    if (!this.props.me || this.state.budget === 0) return
    await firestore()
      .collection(Collections.users)
      .add({
        uid: this.props.me.uid,
        budget: this.state.budget,
        createdAt: moment().format('YYYY/MM/DD HH:mm:ss'),
      })
    this.setState({ budget: 0 })
    if (this.budgetInputRef.current) this.budgetInputRef.current.value = ''
  }

  onbudgetChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ budget: Number(e.target.value) })
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
                placeholder="予算金額"
                ref={this.budgetInputRef}
                onChange={this.onbudgetChanged}
              />
            </p>
            <p className="control">
              <button
                className="button is-info"
                onClick={this.onRegisterBudgetClicked}
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
export default RegisterBudget
