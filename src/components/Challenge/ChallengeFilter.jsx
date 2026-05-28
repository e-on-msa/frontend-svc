const filterOptions = [
  { label: "전체", value: "all" },
  { label: "모집중", value: "open" },
  { label: "마감", value: "closed" },
];

const ChallengeFilter = ({ filter, setFilter }) => (
  <select
    value={filter}
    onChange={e => setFilter(e.target.value)}
    style={{
      padding: "7px 18px 7px 10px",
      border: "1px solid #e0e7ef",
      borderRadius: "7px",
      fontSize: "15px"
    }}
  >
    {filterOptions.map((option) => (
      <option value={option.value} key={option.value}>{option.label}</option>
    ))}
  </select>
);

export default ChallengeFilter;
