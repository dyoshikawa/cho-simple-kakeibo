import * as React from 'react'

interface Item {
  id: string
  price: number
  userUid: string
  createdAt: string
}

interface Props {
  items: Item[]
  onRemoveItemClicked: (id: string) => Promise<void>
}

const ItemList: React.FC<Props> = props => (
  <section className="section">
    <div className="container">
      {props.items.map(item => (
        <div className="card" key={item.id}>
          <div className="card-content">
            <p className="title">{item.price}円</p>
            <p className="subtitle">{item.createdAt}</p>
            <button
              className="button is-danger"
              onClick={() => props.onRemoveItemClicked(item.id)}
            >
              <i className="fa-trash-alt far" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
)

export default ItemList
