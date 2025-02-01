const TodoItem = ({ id, text, isComplete, handleDelete, handleToggle}) => {
    return (
        <li key={id} className="list-group-item">
            <div className="d-flex justify-content-between">
                <input 
                    className="form-check-input me-2" 
                    type="checkbox" 
                    checked={isComplete} 
                    onChange={() => handleToggle(id)}
                />
                <div className={`text-start flex-grow-1 ${isComplete ? 'text-decoration-line-through' : ''}`}>
                    {text}
                </div>
                <i 
                    className="fa-solid fa-trash cursor-pointer myTrashCan"
                    onClick={() => handleDelete(id)}
                ></i>
            </div>
        </li>
    );
};

export default TodoItem;

