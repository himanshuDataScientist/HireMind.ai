// Optional: load into Neo4j Aura / Desktop to run real graph queries on the same demo data.
CREATE (a:Person {id:'demo_1', name:'Aarav Mehta'}), (b:Person {id:'demo_2', name:'Diya Sharma'}),
       (c:Person {id:'demo_3', name:'Rohan Iyer'}), (d:Person {id:'demo_5', name:'Kabir Singh'}),
       (py:Skill {name:'python'}), (ml:Skill {name:'machine learning'}), (aws:Skill {name:'aws'}), (rx:Skill {name:'react'}),
       (n:Company {name:'Nimbus Analytics'}), (k:Company {name:'Kestrel Labs'}), (m:Company {name:'Meridian Cloud'})
CREATE (a)-[:HAS_SKILL]->(py), (a)-[:HAS_SKILL]->(ml), (d)-[:HAS_SKILL]->(py), (c)-[:HAS_SKILL]->(aws), (b)-[:HAS_SKILL]->(rx)
CREATE (a)-[:APPLIED_TO]->(n), (d)-[:APPLIED_TO]->(k), (c)-[:APPLIED_TO]->(m)
CREATE (a)-[:KNOWS]->(b), (a)-[:KNOWS]->(d), (c)-[:KNOWS]->(b);
// Who do I know at companies I applied to? 
// MATCH (me:Person {id:'demo_1'})-[:KNOWS*1..2]-(p:Person)-[:APPLIED_TO]->(c:Company) RETURN DISTINCT p.name, c.name;
