{

  manager(id: 1){
    name, id, managedLocations {
      id, name
    }
  }
}

{

  location(id: 1){
    name, id, manager {
      id, name
    }
  }
}

mutation {
  addLocation(name: "Honolulu-3", managerId: 1){
    name
    id
  }
}

{locations {
  id, name, manager{ id, name }
}
}

mutation {
  addManager(name: "Abraham Niagra"){
    name
    id
  }
}

{managers {
  id, name,
}
}
