import BaseRepository from "./BaseRepository.js";

const mapFromDb = (row) => ({
  id_Priority: row.id,
  name: row.name,
});

const mapToDb = (entity) => ({
  name: entity.name,
});

class PriorityRepository extends BaseRepository {
  constructor() {
    super("priorities", {
      primaryKey: "id",
      mapFromDb,
      mapToDb,
    });
  }
}

export default PriorityRepository;
