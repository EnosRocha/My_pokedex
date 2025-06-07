import { useLocation } from "react-router-dom";

function UsersList() {
  const location = useLocation();
  const users = location.state?.users;

  console.log(users);

  return (
    <div className="h-screen w-screen overflow-hidden bg-orange-500">
      <div
        className="flex flex-col items-center
       justify-center h-full w-full"
      >
        <h1
          className="
            font-bold rounded-md"
        >
          Mestres Pokemons cadastrados
        </h1>
        {users &&
          users.map((p) => {
            return (
              <div key={p.id} className="
              flex flex-wrap">
                <p>Name:{p.userName};</p>
                <p>Pokemons: {p.pokemons}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
}
export default UsersList;
